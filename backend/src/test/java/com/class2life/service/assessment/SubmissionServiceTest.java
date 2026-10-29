package com.class2life.service.assessment;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.class2life.dto.assessment.GradeSubmissionRequest;
import com.class2life.dto.assessment.SubmissionResponse;
import com.class2life.entity.assessment.Assignment;
import com.class2life.entity.assessment.AssignmentType;
import com.class2life.entity.assessment.Submission;
import com.class2life.entity.course.Lesson;
import com.class2life.entity.user.User;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.mapper.SubmissionMapper;
import com.class2life.repository.assessment.AssignmentRepository;
import com.class2life.repository.assessment.SubmissionRepository;
import com.class2life.service.course.CourseService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

@ExtendWith(MockitoExtension.class)
class SubmissionServiceTest {

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private CourseService courseService;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private UserReferenceProvider userReferenceProvider;

    private SubmissionService submissionService;

    private final UUID assignmentId = UUID.randomUUID();
    private final UUID lessonId = UUID.randomUUID();
    private final UUID learnerId = UUID.randomUUID();
    private final UUID instructorId = UUID.randomUUID();

    private Assignment assignment;
    private User learner;

    @BeforeEach
    void setUp() {
        submissionService = new SubmissionService(assignmentRepository, submissionRepository, courseService,
                fileStorageService, userReferenceProvider, new SubmissionMapper());

        Lesson lesson = new Lesson();
        lesson.setId(lessonId);

        assignment = new Assignment();
        assignment.setId(assignmentId);
        assignment.setLesson(lesson);
        assignment.setType(AssignmentType.FILE_SUBMISSION);

        learner = new User();
        learner.setId(learnerId);
        learner.setFullName("Learner One");
    }

    private MockMultipartFile pdfFile() {
        return new MockMultipartFile("file", "report.pdf", "application/pdf", "content".getBytes());
    }

    @Test
    void submitFile_Success() {
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));
        when(fileStorageService.uploadFile(any(), eq("submissions/" + assignmentId))).thenReturn("http://storage/report.pdf");
        when(userReferenceProvider.getReference(learnerId)).thenReturn(learner);
        when(submissionRepository.save(any(Submission.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SubmissionResponse response = submissionService.submitFile(assignmentId, learnerId, pdfFile());

        assertEquals("http://storage/report.pdf", response.fileUrl());
        assertEquals(learnerId, response.learnerId());
        assertEquals(assignmentId, response.assignmentId());
    }

    @Test
    void submitFile_EmptyFile_ThrowsInvalidFile() {
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));
        MockMultipartFile emptyFile = new MockMultipartFile("file", "empty.pdf", "application/pdf", new byte[0]);

        ApiException exception = assertThrows(ApiException.class,
                () -> submissionService.submitFile(assignmentId, learnerId, emptyFile));

        assertEquals(ErrorCode.INVALID_FILE, exception.getErrorCode());
        verify(submissionRepository, never()).save(any(Submission.class));
    }

    @Test
    void submitFile_DeadlinePassed_ThrowsDeadlinePassed() {
        assignment.setDeadline(LocalDateTime.now().minusHours(1));
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));

        ApiException exception = assertThrows(ApiException.class,
                () -> submissionService.submitFile(assignmentId, learnerId, pdfFile()));

        assertEquals(ErrorCode.DEADLINE_PASSED, exception.getErrorCode());
        verify(submissionRepository, never()).save(any(Submission.class));
    }

    @Test
    void submitFile_QuizAssignment_ThrowsTypeMismatch() {
        assignment.setType(AssignmentType.QUIZ);
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));

        ApiException exception = assertThrows(ApiException.class,
                () -> submissionService.submitFile(assignmentId, learnerId, pdfFile()));

        assertEquals(ErrorCode.ASSIGNMENT_TYPE_MISMATCH, exception.getErrorCode());
    }

    @Test
    void gradeSubmission_Success() {
        UUID submissionId = UUID.randomUUID();
        Submission submission = new Submission();
        submission.setId(submissionId);
        submission.setAssignment(assignment);
        submission.setUser(learner);

        User instructor = new User();
        instructor.setId(instructorId);

        when(submissionRepository.findById(submissionId)).thenReturn(Optional.of(submission));
        when(courseService.isLessonOwnedByInstructor(lessonId, instructorId)).thenReturn(true);
        when(userReferenceProvider.getReference(instructorId)).thenReturn(instructor);
        when(submissionRepository.save(any(Submission.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SubmissionResponse response = submissionService.gradeSubmission(
                submissionId, instructorId, new GradeSubmissionRequest(new BigDecimal("8.5"), "Well done"));

        assertEquals(0, new BigDecimal("8.5").compareTo(response.score()));
        assertEquals("Well done", response.feedback());
        assertEquals(instructorId, response.gradedBy());
        assertNotNull(response.gradedAt());
    }

    @Test
    void gradeSubmission_NotOwner_ThrowsForbidden() {
        UUID submissionId = UUID.randomUUID();
        Submission submission = new Submission();
        submission.setId(submissionId);
        submission.setAssignment(assignment);
        submission.setUser(learner);

        when(submissionRepository.findById(submissionId)).thenReturn(Optional.of(submission));
        when(courseService.isLessonOwnedByInstructor(lessonId, instructorId)).thenReturn(false);

        ApiException exception = assertThrows(ApiException.class, () -> submissionService.gradeSubmission(
                submissionId, instructorId, new GradeSubmissionRequest(new BigDecimal("9"), null)));

        assertEquals(ErrorCode.FORBIDDEN, exception.getErrorCode());
        verify(submissionRepository, never()).save(any(Submission.class));
    }

    @Test
    void gradeSubmission_NotFound_ThrowsSubmissionNotFound() {
        UUID submissionId = UUID.randomUUID();
        when(submissionRepository.findById(submissionId)).thenReturn(Optional.empty());

        ApiException exception = assertThrows(ApiException.class, () -> submissionService.gradeSubmission(
                submissionId, instructorId, new GradeSubmissionRequest(new BigDecimal("9"), null)));

        assertEquals(ErrorCode.SUBMISSION_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void getLatestSubmissions_NotOwner_ThrowsForbidden() {
        when(assignmentRepository.findById(assignmentId)).thenReturn(Optional.of(assignment));
        when(courseService.isLessonOwnedByInstructor(lessonId, instructorId)).thenReturn(false);

        ApiException exception = assertThrows(ApiException.class,
                () -> submissionService.getLatestSubmissions(assignmentId, instructorId, 0, 10));

        assertEquals(ErrorCode.FORBIDDEN, exception.getErrorCode());
    }
}