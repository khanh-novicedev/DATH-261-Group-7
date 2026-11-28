package com.class2life.service.assessment;

import com.class2life.dto.assessment.AssignmentResponse;
import com.class2life.dto.assessment.CreateAssignmentRequest;
import com.class2life.dto.assessment.CreateQuizOptionRequest;
import com.class2life.dto.assessment.CreateQuizQuestionRequest;
import com.class2life.dto.assessment.LessonAssignmentResponse;
import com.class2life.dto.assessment.QuizQuestionResponse;
import com.class2life.entity.assessment.Assignment;
import com.class2life.entity.assessment.AssignmentType;
import com.class2life.entity.assessment.QuizOption;
import com.class2life.entity.assessment.QuizQuestion;
import com.class2life.entity.course.Lesson;
import com.class2life.entity.user.User;
import com.class2life.entity.user.UserRole;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.mapper.AssignmentMapper;
import com.class2life.repository.assessment.AssignmentRepository;
import com.class2life.repository.assessment.QuizAttemptRepository;
import com.class2life.repository.assessment.QuizOptionRepository;
import com.class2life.repository.assessment.QuizQuestionRepository;
import com.class2life.repository.assessment.SubmissionRepository;
import com.class2life.repository.user.UserRepository;
import com.class2life.service.course.CourseService;
import com.class2life.service.enrolment.EnrolmentService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class AssignmentService {

    private static final int DEFAULT_QUESTION_POINTS = 1;

    private final AssignmentRepository assignmentRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizOptionRepository quizOptionRepository;
    private final CourseService courseService;
    private final AssignmentMapper assignmentMapper;
    private final UserRepository userRepository;
    private final EnrolmentService enrolmentService;
    private final SubmissionRepository submissionRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public AssignmentService(AssignmentRepository assignmentRepository,
                             QuizQuestionRepository quizQuestionRepository,
                             QuizOptionRepository quizOptionRepository,
                             CourseService courseService,
                             AssignmentMapper assignmentMapper,
                             UserRepository userRepository,
                             EnrolmentService enrolmentService,
                             SubmissionRepository submissionRepository,
                             QuizAttemptRepository quizAttemptRepository) {
        this.submissionRepository = submissionRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.assignmentRepository = assignmentRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.quizOptionRepository = quizOptionRepository;
        this.courseService = courseService;
        this.assignmentMapper = assignmentMapper;
        this.userRepository = userRepository;
        this.enrolmentService = enrolmentService;
    }

    // API-25: the instructor is the logged-in user (from the JWT), never a client-supplied id
    @Transactional
    public AssignmentResponse createAssignment(UUID lessonId, CreateAssignmentRequest request) {
        User instructor = currentUser();
        if (instructor.getRole() != UserRole.INSTRUCTOR) {
            throw new ApiException(ErrorCode.FORBIDDEN, "Only instructors can create assignments");
        }

        Lesson lesson = courseService.getLessonOrThrow(lessonId);

        if (!courseService.isLessonOwnedByInstructor(lessonId, instructor.getId())) {
            throw new ApiException(ErrorCode.FORBIDDEN, "You can only add assignments to your own courses");
        }

        // All business rules are checked before anything is written
        validateByType(request);

        Assignment assignment = new Assignment();
        assignment.setLesson(lesson);
        assignment.setTitle(request.title());
        assignment.setType(request.type());
        assignment.setInstructions(request.instructions());
        assignment.setPassScore(request.passScore());
        assignment.setDeadline(request.deadline());
        Assignment savedAssignment = assignmentRepository.save(assignment);

        if (request.type() == AssignmentType.QUIZ) {
            saveQuestionsAndOptions(savedAssignment, request.questions());
        }

        return assignmentMapper.toAssignmentResponse(savedAssignment);
    }

    // API-26: enrolled learners, the course owner and admins
    @Transactional(readOnly = true)
    public List<LessonAssignmentResponse> getAssignmentsByLesson(UUID lessonId) {
        User user = currentUser();
        // Fails with 404 when the lesson does not exist
        Lesson lesson = courseService.getLessonOrThrow(lessonId);

        switch (user.getRole()) {
            case ADMIN -> { }
            case INSTRUCTOR -> {
                if (!courseService.isLessonOwnedByInstructor(lessonId, user.getId())) {
                    throw new ApiException(ErrorCode.FORBIDDEN, "You can only view assignments of your own courses");
                }
            }
            case LEARNER -> requireEnrolled(user, lesson);
            default -> throw new ApiException(ErrorCode.FORBIDDEN);
        }

        List<Assignment> assignments = assignmentRepository.findByLessonIdOrderByCreatedAtAsc(lessonId);
        if (user.getRole() != UserRole.LEARNER) {
            // submitted only describes a learner's own work; instructors/admins get null
            return assignments.stream().map(a -> assignmentMapper.toLessonAssignmentResponse(a, null)).toList();
        }
        // Two queries for the whole lesson instead of one per assignment
        Set<UUID> done = new HashSet<>(submissionRepository.findSubmittedAssignmentIds(user.getId(), lessonId));
        done.addAll(quizAttemptRepository.findAttemptedAssignmentIds(user.getId(), lessonId));
        return assignments.stream()
                .map(a -> assignmentMapper.toLessonAssignmentResponse(a, done.contains(a.getId())))
                .toList();
    }

    // API-27, learner-facing: the response DTOs have no is_correct field, so it cannot leak
    @Transactional(readOnly = true)
    public List<QuizQuestionResponse> getQuizQuestions(UUID assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ApiException(ErrorCode.ASSIGNMENT_NOT_FOUND, "Assignment not found"));

        if (assignment.getType() != AssignmentType.QUIZ) {
            throw new ApiException(ErrorCode.ASSIGNMENT_TYPE_MISMATCH, "This assignment is not a quiz");
        }

        // Only an enrolled learner may take the quiz (spec role: Student)
        User user = currentUser();
        if (user.getRole() != UserRole.LEARNER) {
            throw new ApiException(ErrorCode.FORBIDDEN, "Only learners can take quizzes");
        }
        requireEnrolled(user, assignment.getLesson());

        // Two queries in total, both in a stable order
        List<QuizQuestion> questions = quizQuestionRepository.findByAssignmentIdOrderByIdAsc(assignmentId);
        List<QuizOption> options = quizOptionRepository.findByQuestionAssignmentIdOrderByIdAsc(assignmentId);
        return assignmentMapper.toQuizQuestionResponses(questions, options);
    }

    private void requireEnrolled(User learner, Lesson lesson) {
        UUID courseId = lesson.getCourse().getId();
        if (!enrolmentService.isEnrolled(learner.getId(), courseId)) {
            throw new ApiException(ErrorCode.NOT_ENROLLED, "You must be enrolled in this course");
        }
    }

    private void validateByType(CreateAssignmentRequest request) {
        List<CreateQuizQuestionRequest> questions = request.questions() == null ? List.of() : request.questions();

        if (request.type() == AssignmentType.FILE_SUBMISSION) {
            if (!questions.isEmpty()) {
                throw new ApiException(ErrorCode.ASSIGNMENT_TYPE_MISMATCH,
                        "A file submission assignment cannot contain quiz questions");
            }
            if (request.passScore() != null) {
                throw new ApiException(ErrorCode.VALIDATION_ERROR,
                        "Pass score only applies to quizzes");
            }
            return;
        }

        // QUIZ
        if (questions.isEmpty()) {
            throw new ApiException(ErrorCode.VALIDATION_ERROR, "A quiz needs at least one question");
        }

        int totalPoints = 0;
        for (CreateQuizQuestionRequest question : questions) {
            List<CreateQuizOptionRequest> options = question.options() == null ? List.of() : question.options();
            if (options.size() < 2) {
                throw new ApiException(ErrorCode.VALIDATION_ERROR, "Each question needs at least two options");
            }
            boolean hasCorrectOption = options.stream().anyMatch(option -> Boolean.TRUE.equals(option.isCorrect()));
            if (!hasCorrectOption) {
                throw new ApiException(ErrorCode.VALIDATION_ERROR, "Each question needs at least one correct option");
            }
            totalPoints += pointsOf(question);
        }

        if (request.passScore() != null && request.passScore() > totalPoints) {
            throw new ApiException(ErrorCode.VALIDATION_ERROR,
                    "Pass score cannot be higher than the total points of the quiz (" + totalPoints + ")");
        }
    }

    private void saveQuestionsAndOptions(Assignment assignment, List<CreateQuizQuestionRequest> questionRequests) {
        List<QuizQuestion> questions = new ArrayList<>();
        List<QuizOption> options = new ArrayList<>();

        for (CreateQuizQuestionRequest questionRequest : questionRequests) {
            QuizQuestion question = new QuizQuestion();
            question.setAssignment(assignment);
            question.setContent(questionRequest.content());
            question.setPoints(pointsOf(questionRequest));
            questions.add(question);

            for (CreateQuizOptionRequest optionRequest : questionRequest.options()) {
                QuizOption option = new QuizOption();
                option.setQuestion(question);
                option.setContent(optionRequest.content());
                option.setIsCorrect(Boolean.TRUE.equals(optionRequest.isCorrect()));
                options.add(option);
            }
        }

        // Questions are saved first so that the options reference persisted rows
        quizQuestionRepository.saveAll(questions);
        quizOptionRepository.saveAll(options);
    }

    private int pointsOf(CreateQuizQuestionRequest question) {
        return question.points() == null ? DEFAULT_QUESTION_POINTS : question.points();
    }

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || "anonymousUser".equals(auth.getName())) {
            throw new ApiException(ErrorCode.UNAUTHORIZED);
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }
}