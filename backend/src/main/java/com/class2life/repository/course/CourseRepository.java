package com.class2life.repository.course;

import com.class2life.entity.course.Course;
import com.class2life.entity.course.CourseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    // Viết câu lệnh JPQL để tìm kiếm và phân trang
    @Query("SELECT c FROM Course c WHERE " +
           "LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) AND " +
           "(:category IS NULL OR c.category = :category) AND " +
           "c.status = :status")
    Page<Course> findCoursesByFilters(
            @Param("keyword") String keyword,
            @Param("category") String category,
            @Param("status") CourseStatus status,
            Pageable pageable
    );
}