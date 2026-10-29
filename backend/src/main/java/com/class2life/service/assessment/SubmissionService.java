package com.class2life.service.assessment;

import com.class2life.common.PageResponse;
import com.class2life.dto.assessment.GradeSubmissionRequest;
import com.class2life.dto.assessment.SubmissionResponse;
import com.class2life.entity.assessment.Assignment;
import com.class2life.entity.assessment.AssignmentType;
import com.class2life.entity.assessment.Submission;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.mapper.SubmissionMapper;
import com.class2life.repository.assessment.AssignmentRepository;
import com.class2life.repository.assessment.SubmissionRepository;
import com.class2life.service.course.CourseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class SubmissionService {

    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final CourseService courseService;
    private final FileStorageService fileStorageService;
    private final UserReferenceProvider userReferenceProvider;
    private final SubmissionMapper submissionMapper;

    public SubmissionService(AssignmentRepository assignmentRepository,
                             SubmissionRepository submissionRepository,
                             CourseService courseService,
                             FileStorageService fileStorageService,
                             UserReferenceProvider userReferenceProvider,
                             SubmissionMapper submissionMapper) {
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.courseService = courseService;
        this.fileStorageService = fileStorageService;
        this.userReferenceProvider = userReferenceProvider;
        this.submissionMapper = submissionMapper;
    }

    // A learner may resubmit: every upload is a new row, and the instructor sees the latest one
    @Transactional
    public SubmissionResponse submitFile(UUID assignmentId, UUID userId, MultipartFile file) {
        Assignment assignment = findFileAssignmentOrThrow(assignmentId);

        // TODO: the learner must be enrolled in the course of this lesson:
        // call EnrolmentService.isEnrolled(userId, courseId) once Khanh Phat implements it

        if (assignment.getDeadline() != null && LocalDateTime.now().isAfter(assignment.getDeadline())) {
            throw new ApiException(ErrorCode.DEADLINE_PASSED, "The deadline of this assignment has passed");
        }

        if (file == null || file.isEmpty() || file.getOriginalFilename() == null
                || file.getOriginalFilename().isBlank()) {
            throw new ApiException(ErrorCode.INVALID_FILE, "A non-empty file is required");
        }

        String fileUrl = fileStorageService.uploadFile(file, "submissions/" + assignmentId);

        Submission submission = new Submission();
        submission.setAssignment(assignment);
        submission.setUser(userReferenceProvider.getReference(userId));
        submission.setFileUrl(fileUrl);
        Submission savedSubmission = submissionRepository.save(submission);

        return submissionMapper.toSubmissionResponse(savedSubmission);
    }

    // Learner view: the whole submission history of one learner, newest first
    @Transactional(readOnly = true)
    public PageResponse<SubmissionResponse> getMySubmissions(UUID assignmentId, UUID userId, int page, int size) {
        findFileAssignmentOrThrow(assignmentId);

        Page<Submission> submissions = submissionRepository.findByAssignmentIdAndUserId(
                assignmentId, userId, AssessmentPaging.of(page, size, Sort.by(Sort.Direction.DESC, "submittedAt")));
        return PageResponse.of(submissions.map(submissionMapper::toSubmissionResponse));
    }

    // Instructor view: only the most recent submission of each learner
    @Transactional(readOnly = true)
    public PageResponse<SubmissionResponse> getLatestSubmissions(UUID assignmentId, UUID instructorId, int page, int size) {
        Assignment assignment = findFileAssignmentOrThrow(assignmentId);
        assertInstructorOwnsAssignment(assignment, instructorId);

        Page<Submission> submissions = submissionRepository.findLatestByAssignmentId(
                assignmentId, AssessmentPaging.of(page, size, Sort.by(Sort.Direction.DESC, "submittedAt")));
        return PageResponse.of(submissions.map(submissionMapper::toSubmissionResponse));
    }

    @Transactional
    public SubmissionResponse gradeSubmission(UUID submissionId, UUID instructorId, GradeSubmissionRequest request) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ApiException(ErrorCode.SUBMISSION_NOT_FOUND, "Submission not found"));
        assertInstructorOwnsAssignment(submission.getAssignment(), instructorId);

        submission.setScore(request.score());
        submission.setFeedback(request.feedback());
        submission.setGradedBy(userReferenceProvider.getReference(instructorId));
        submission.setGradedAt(LocalDateTime.now());
        Submission gradedSubmission = submissionRepository.save(submission);

        // TODO: notify the learner of the result once Khanh Phat implements NotificationService
        // (its stub currently throws UnsupportedOperationException, so the call is not active yet):
        // notificationService.notifyUser(submission.getUser().getId(), NotificationType.SYSTEM,
        //         "Your submission for \"" + submission.getAssignment().getTitle() + "\" has been graded");

        return submissionMapper.toSubmissionResponse(gradedSubmission);
    }

    private Assignment findFileAssignmentOrThrow(UUID assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ApiException(ErrorCode.ASSIGNMENT_NOT_FOUND, "Assignment not found"));
        if (assignment.getType() != AssignmentType.FILE_SUBMISSION) {
            throw new ApiException(ErrorCode.ASSIGNMENT_TYPE_MISMATCH, "This assignment is not a file submission");
        }
        return assignment;
    }

    private void assertInstructorOwnsAssignment(Assignment assignment, UUID instructorId) {
        if (!courseService.isLessonOwnedByInstructor(assignment.getLesson().getId(), instructorId)) {
            throw new ApiException(ErrorCode.FORBIDDEN, "You can only manage assignments of your own courses");
        }
    }
}