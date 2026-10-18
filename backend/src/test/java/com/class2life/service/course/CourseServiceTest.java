package com.class2life.service.course;

import com.class2life.dto.course.CourseResponse;
import com.class2life.dto.course.CreateCourseRequest;
import com.class2life.entity.Course;
import com.class2life.entity.CourseStatus;
import com.class2life.mapper.CourseMapper;
import com.class2life.repository.course.CourseRepository;
import com.class2life.repository.course.LessonRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

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
                CourseStatus.DRAFT,
                new ArrayList<>(),
                null,
                null
        );

        when(courseRepository.save(any(Course.class))).thenReturn(mockSavedCourse);
        when(courseMapper.toCourseResponse(any(Course.class), anyList())).thenReturn(mockResponse);

        CourseResponse result = courseService.createCourse(request);

        assertNotNull(result);
        assertEquals("Presentation Skills", result.title());
        assertEquals(CourseStatus.DRAFT, result.status());

        verify(courseRepository, times(1)).save(any(Course.class));
    }
}