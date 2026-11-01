package com.class2life.service.course;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import com.class2life.common.PageResponse;
import com.class2life.dto.course.CourseCatalogResponse;
import com.class2life.entity.course.Course;
import com.class2life.entity.course.CourseStatus;
import com.class2life.entity.user.User;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.mapper.CourseMapper;
import com.class2life.repository.course.CourseRepository;
import com.class2life.repository.course.LessonRepository;
import com.class2life.repository.user.UserRepository;

@ExtendWith(MockitoExtension.class)
class CourseCatalogServiceTest {
    @Mock
    private CourseRepository courseRepository;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private CourseMapper courseMapper;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CourseService courseService;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    private void loginAs(String email, String role) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(email, null, List.of(new SimpleGrantedAuthority("ROLE_" + role))));
    }

    private LessonRepository.LessonCount lessonCount(UUID courseId, long count) {
        return new LessonRepository.LessonCount() {
            public UUID getCourseId() { return courseId; }
            public Long getLessonCount() { return count; }
        };
    }

    @Test
    void getCourseCatalog_Success() {
        loginAs("learner@class2life.com", "LEARNER");
        User instructor = new User();
        instructor.setId(UUID.randomUUID());
        instructor.setFullName("Instructor User");

        Course mockCourse = new Course();
        mockCourse.setId(UUID.randomUUID());
        mockCourse.setTitle("Advanced Communication");
        mockCourse.setCategory("Soft Skills");
        mockCourse.setStatus(CourseStatus.PUBLISHED);
        mockCourse.setInstructor(instructor);

        when(courseRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(mockCourse), PageRequest.of(0, 20), 1));
        when(lessonRepository.countByCourseIds(List.of(mockCourse.getId())))
                .thenReturn(List.of(lessonCount(mockCourse.getId(), 5)));

        PageResponse<CourseCatalogResponse> result = courseService.getCourseCatalog(null, "Soft Skills", null, false, 0, 20);

        assertNotNull(result);
        assertEquals(1, result.items().size());
        CourseCatalogResponse item = result.items().get(0);
        assertEquals("Advanced Communication", item.title());
        assertEquals(5, item.lessonCount());
        assertEquals(instructor.getId(), item.instructor().id());
        assertEquals("Instructor User", item.instructor().fullName());
        assertEquals(1, result.totalElements());
        verify(userRepository, never()).findByEmail(any());
    }

    @Test
    void getCourseCatalog_CourseWithoutLessons_CountsZero() {
        loginAs("admin@class2life.com", "ADMIN");
        Course mockCourse = new Course();
        mockCourse.setId(UUID.randomUUID());
        mockCourse.setTitle("Empty Course");
        mockCourse.setStatus(CourseStatus.DRAFT);

        when(courseRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(mockCourse), PageRequest.of(0, 20), 1));
        when(lessonRepository.countByCourseIds(any())).thenReturn(List.of());

        PageResponse<CourseCatalogResponse> result = courseService.getCourseCatalog(null, null, CourseStatus.DRAFT, false, 0, 20);

        assertEquals(0, result.items().get(0).lessonCount());
        assertNull(result.items().get(0).instructor());
    }

    @Test
    void getCourseCatalog_InstructorMine_LooksUpCurrentUser() {
        loginAs("instructor@class2life.com", "INSTRUCTOR");
        User instructor = new User();
        instructor.setId(UUID.randomUUID());
        when(userRepository.findByEmail("instructor@class2life.com")).thenReturn(Optional.of(instructor));
        when(courseRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(Page.empty());

        PageResponse<CourseCatalogResponse> result = courseService.getCourseCatalog("", null, null, true, 0, 20);

        assertEquals(0, result.items().size());
        verify(userRepository, times(1)).findByEmail("instructor@class2life.com");
        verify(lessonRepository, never()).countByCourseIds(any());
    }

    @Test
    void getCourseCatalog_SizeIsCappedAt100() {
        loginAs("learner@class2life.com", "LEARNER");
        when(courseRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(Page.empty());

        courseService.getCourseCatalog(null, null, null, false, 2, 500);

        ArgumentCaptor<Pageable> pageable = ArgumentCaptor.forClass(Pageable.class);
        verify(courseRepository).findAll(any(Specification.class), pageable.capture());
        assertEquals(2, pageable.getValue().getPageNumber());
        assertEquals(100, pageable.getValue().getPageSize());
    }

    @Test
    void getCourseCatalog_NegativePage_ThrowsValidationError() {
        ApiException ex = assertThrows(ApiException.class,
                () -> courseService.getCourseCatalog(null, null, null, false, -1, 20));
        assertEquals(ErrorCode.VALIDATION_ERROR, ex.getErrorCode());
    }

    @Test
    void getCourseCatalog_ZeroSize_ThrowsValidationError() {
        ApiException ex = assertThrows(ApiException.class,
                () -> courseService.getCourseCatalog(null, null, null, false, 0, 0));
        assertEquals(ErrorCode.VALIDATION_ERROR, ex.getErrorCode());
    }
}
