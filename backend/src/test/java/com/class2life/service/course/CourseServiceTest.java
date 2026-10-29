package com.class2life.service.course;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import org.junit.jupiter.api.AfterEach;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.class2life.entity.user.User;
import com.class2life.repository.user.UserRepository;

import com.class2life.common.PageResponse;
import com.class2life.dto.course.CourseCatalogResponse;
import com.class2life.dto.course.CourseResponse;
import com.class2life.dto.course.CreateCourseRequest;
import com.class2life.entity.course.Course;
import com.class2life.entity.course.CourseStatus;
import com.class2life.mapper.CourseMapper;
import com.class2life.repository.course.CourseRepository;
import com.class2life.entity.course.Lesson;
import com.class2life.repository.course.LessonRepository;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {
    @Mock
    private CourseRepository courseRepository;

    @Mock // just added
    private UserRepository userRepository;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private CourseMapper courseMapper;

    @InjectMocks
    private CourseService courseService;

    @Test
    void createCourse_Success() {
        CreateCourseRequest request = new CreateCourseRequest(
                "Presentation Skills",
                "Course description",
                "Soft Skills",
                new ArrayList<>()
        );

        Course mockSavedCourse = new Course();
        mockSavedCourse.setId(UUID.randomUUID());
        mockSavedCourse.setTitle("Presentation Skills");
        mockSavedCourse.setStatus(CourseStatus.DRAFT);

        CourseResponse mockResponse = new CourseResponse(
                mockSavedCourse.getId(),
                UUID.randomUUID(),
                "Presentation Skills",
                "Course description",
                "Soft Skills",
//                null, // Thêm dòng null này cho trường prerequisites mới
                CourseStatus.DRAFT,
                new ArrayList<>(),
                null,
                null
        );

        when(courseRepository.save(any(Course.class))).thenReturn(mockSavedCourse);
        when(courseMapper.toCourseResponse(any(Course.class), anyList())).thenReturn(mockResponse);


        //------------

        String email = "instructor@class2life.com";
        User instructor = new User();
        instructor.setEmail(email);

        SecurityContextHolder.getContext().setAuthentication(
        new UsernamePasswordAuthenticationToken(
                email,
                null,
                java.util.Collections.emptyList()
        )
        );

        when(userRepository.findByEmail(email))
        .thenReturn(Optional.of(instructor));

        //------------


        CourseResponse result = courseService.createCourse(request);

        assertNotNull(result);
        assertEquals("Presentation Skills", result.title());
        assertEquals(CourseStatus.DRAFT, result.status());

        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    void getCourseCatalog_Success() {
        // 1. Chuẩn bị dữ liệu giả lập
        Course mockCourse = new Course();
        mockCourse.setId(UUID.randomUUID());
        mockCourse.setTitle("Advanced Communication");
        mockCourse.setCategory("Soft Skills");
        mockCourse.setStatus(CourseStatus.PUBLISHED);

        Page<Course> mockPage = new PageImpl<>(List.of(mockCourse));

        // 2. Giả lập hành vi của Database
        when(courseRepository.findCoursesByFilters(
                any(), any(), eq(CourseStatus.PUBLISHED), any(PageRequest.class)
        )).thenReturn(mockPage);
        
        when(lessonRepository.countByCourseId(mockCourse.getId())).thenReturn(5); // Giả lập khóa học có 5 bài

        // 3. Thực thi hàm cần test
        PageResponse<CourseCatalogResponse> result = courseService.getCourseCatalog(null, "Soft Skills", 0, 10);

        // 4. Xác nhận kết quả
        assertNotNull(result);
        assertEquals(1, result.items().size()); // Tổng số khóa học trả về là 1
        assertEquals("Advanced Communication", result.items().get(0).title());
        assertEquals(5, result.items().get(0).lessonCount()); // Kiểm tra đếm số bài học chính xác

        // Xác minh repository đã được gọi đúng tham số
        verify(courseRepository, times(1)).findCoursesByFilters(
                any(), any(), eq(CourseStatus.PUBLISHED), any(PageRequest.class)
        );
        verify(lessonRepository, times(1)).countByCourseId(mockCourse.getId());
    }

    @Test
    void getCourseDetails_LimitedView_Success() {
        // 1. Chuẩn bị dữ liệu giả
        UUID courseId = UUID.randomUUID();
        Course mockCourse = new Course();
        mockCourse.setId(courseId);
        mockCourse.setTitle("Public Course");
        mockCourse.setStatus(CourseStatus.PUBLISHED);

        Lesson mockLesson = new Lesson();
        mockLesson.setId(UUID.randomUUID());
        mockLesson.setSequenceNumber(1);
        mockLesson.setTitle("Secret Lesson");
        mockLesson.setContentUrl("https://secret-video.mp4"); // Có chứa URL thật

        // Giả lập hộp đồ ăn mà Mapper sẽ trả về (đã giấu URL thành null)
        CourseResponse mockResponse = new CourseResponse(
                courseId, null, "Public Course", null, null, CourseStatus.PUBLISHED,
                List.of(new com.class2life.dto.course.LessonResponse(
                        mockLesson.getId(), 1, "Secret Lesson", null, null, null, null)),
                null, null
        );

        // 2. Giả lập Database VÀ Mapper
        when(courseRepository.findById(courseId)).thenReturn(java.util.Optional.of(mockCourse));
        when(lessonRepository.findByCourseIdOrderBySequenceNumberAsc(courseId)).thenReturn(List.of(mockLesson));
        
        // Dạy cho Mock Mapper biết phải trả về cái gì khi nhận lệnh ẩn (false)
        when(courseMapper.toCourseResponse(any(Course.class), anyList(), eq(false))).thenReturn(mockResponse);

        // 3. Chạy hàm lấy chi tiết
        CourseResponse result = courseService.getCourseDetails(courseId);

        // 4. Kiểm tra
        assertNotNull(result);
        assertEquals("Public Course", result.title());
        org.junit.jupiter.api.Assertions.assertNull(result.lessons().get(0).contentUrl(), "URL bài học phải bị giấu (null) với Limited View");

        // Dòng quyết định: Đảm bảo Service đã ra lệnh giấu URL (isFullView = false) cho Mapper
        verify(courseMapper, times(1)).toCourseResponse(any(Course.class), anyList(), eq(false));
    }

    @AfterEach
        void clearSecurityContext() {
    SecurityContextHolder.clearContext();
        }
}