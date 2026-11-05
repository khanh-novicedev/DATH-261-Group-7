package com.class2life.service.interaction;

import com.class2life.dto.interaction.QnaRequest;
import com.class2life.dto.interaction.QnaResponse;
import com.class2life.entity.course.Lesson;
import com.class2life.entity.interaction.LessonQna;
import com.class2life.entity.user.User;
import com.class2life.entity.user.UserRole;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.course.LessonRepository;
import com.class2life.repository.enrolment.EnrolmentRepository;
import com.class2life.repository.interaction.LessonQnaRepository;
import com.class2life.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LessonQnaService {
    private final LessonQnaRepository qnaRepository;
    private final LessonRepository lessonRepository;
    private final EnrolmentRepository enrolmentRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<QnaResponse> list(UUID lessonId) {
        Lesson lesson = lesson(lessonId);
        ensureCanAccessLesson(currentUser(), lesson);
        return qnaRepository.findByLessonIdOrderByCreatedAtAsc(lessonId).stream().map(this::response).toList();
    }

    @Transactional
    public QnaResponse ask(UUID lessonId, QnaRequest request) {
        User user = currentUser();
        Lesson lesson = lesson(lessonId);
        ensureCanAccessLesson(user, lesson);
        LessonQna qna = new LessonQna();
        qna.setLesson(lesson); qna.setAuthor(user); qna.setContent(request.content().trim());
        return response(qnaRepository.save(qna));
    }

    @Transactional
    public QnaResponse reply(UUID qnaId, QnaRequest request) {
        User user = currentUser();
        LessonQna parent = qnaRepository.findByIdAndParentIsNull(qnaId)
                .orElseThrow(() -> new ApiException(ErrorCode.QNA_NOT_FOUND, "Question not found"));
        ensureCanAccessLesson(user, parent.getLesson());
        LessonQna reply = new LessonQna();
        reply.setLesson(parent.getLesson()); reply.setParent(parent); reply.setAuthor(user);
        reply.setContent(request.content().trim());
        return response(qnaRepository.save(reply));
    }

    private void ensureCanAccessLesson(User user, Lesson lesson) {
        if (user.getRole() == UserRole.ADMIN) return;
        if (user.getRole() == UserRole.INSTRUCTOR && lesson.getCourse().getInstructor().getId().equals(user.getId())) return;
        if (user.getRole() == UserRole.LEARNER &&
                enrolmentRepository.existsByUserIdAndCourseId(user.getId(), lesson.getCourse().getId())) return;
        throw new ApiException(ErrorCode.NOT_ENROLLED, "You must be enrolled in the course or own the course to access Q&A");
    }

    private Lesson lesson(UUID id) {
        return lessonRepository.findById(id).orElseThrow(() -> new ApiException(ErrorCode.LESSON_NOT_FOUND));
    }

    private QnaResponse response(LessonQna q) {
        return new QnaResponse(q.getId(), q.getLesson().getId(), q.getAuthor().getId(),
                q.getAuthor().getFullName(), q.getParent() == null ? null : q.getParent().getId(),
                q.getContent(), q.getCreatedAt());
    }

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || "anonymousUser".equals(auth.getName()))
            throw new ApiException(ErrorCode.UNAUTHORIZED);
        return userRepository.findByEmail(auth.getName()).orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }
}
