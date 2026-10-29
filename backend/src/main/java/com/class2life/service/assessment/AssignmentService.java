package com.class2life.service.assessment;

import com.class2life.dto.assessment.AssignmentResponse;
import com.class2life.dto.assessment.CreateAssignmentRequest;
import com.class2life.dto.assessment.CreateQuizOptionRequest;
import com.class2life.dto.assessment.CreateQuizQuestionRequest;
import com.class2life.dto.assessment.QuizQuestionResponse;
import com.class2life.entity.assessment.Assignment;
import com.class2life.entity.assessment.AssignmentType;
import com.class2life.entity.assessment.QuizOption;
import com.class2life.entity.assessment.QuizQuestion;
import com.class2life.entity.course.Lesson;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.mapper.AssignmentMapper;
import com.class2life.repository.assessment.AssignmentRepository;
import com.class2life.repository.assessment.QuizOptionRepository;
import com.class2life.repository.assessment.QuizQuestionRepository;
import com.class2life.service.course.CourseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AssignmentService {

    private static final int DEFAULT_QUESTION_POINTS = 1;

    private final AssignmentRepository assignmentRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final QuizOptionRepository quizOptionRepository;
    private final CourseService courseService;
    private final AssignmentMapper assignmentMapper;

    public AssignmentService(AssignmentRepository assignmentRepository,
                             QuizQuestionRepository quizQuestionRepository,
                             QuizOptionRepository quizOptionRepository,
                             CourseService courseService,
                             AssignmentMapper assignmentMapper) {
        this.assignmentRepository = assignmentRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.quizOptionRepository = quizOptionRepository;
        this.courseService = courseService;
        this.assignmentMapper = assignmentMapper;
    }

    @Transactional
    public AssignmentResponse createAssignment(UUID lessonId, UUID instructorId, CreateAssignmentRequest request) {
        Lesson lesson = courseService.getLessonOrThrow(lessonId);

        if (!courseService.isLessonOwnedByInstructor(lessonId, instructorId)) {
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

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsByLesson(UUID lessonId) {
        // Fails with 404 when the lesson does not exist
        courseService.getLessonOrThrow(lessonId);

        // TODO: a learner may only see assignments of courses they are enrolled in:
        // call EnrolmentService.isEnrolled(userId, courseId) once Khanh Phat implements it
        return assignmentRepository.findByLessonIdOrderByCreatedAtAsc(lessonId).stream()
                .map(assignmentMapper::toAssignmentResponse)
                .toList();
    }

    // Learner-facing questions: the response DTOs have no is_correct field, so it cannot leak
    @Transactional(readOnly = true)
    public List<QuizQuestionResponse> getQuizQuestions(UUID assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ApiException(ErrorCode.ASSIGNMENT_NOT_FOUND, "Assignment not found"));

        if (assignment.getType() != AssignmentType.QUIZ) {
            throw new ApiException(ErrorCode.ASSIGNMENT_TYPE_MISMATCH, "This assignment is not a quiz");
        }

        // TODO: enrolment check with EnrolmentService.isEnrolled(userId, courseId), same as above

        List<QuizQuestion> questions = quizQuestionRepository.findByAssignmentId(assignmentId);
        List<QuizOption> options = quizOptionRepository.findByQuestionAssignmentId(assignmentId);
        return assignmentMapper.toQuizQuestionResponses(questions, options);
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
}