package com.class2life.repository.course;

import com.class2life.entity.course.Course;
import com.class2life.entity.course.CourseStatus;
import org.springframework.data.jpa.domain.Specification;

import java.util.Locale;
import java.util.UUID;

public final class CourseSpecifications {

    private CourseSpecifications() {
    }

    public static Specification<Course> titleContains(String keyword) {
        String escaped = keyword.toLowerCase(Locale.ROOT)
                .replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
        return (root, query, cb) -> cb.like(cb.lower(root.get("title")), "%" + escaped + "%", '\\');
    }

    public static Specification<Course> hasCategory(String category) {
        return (root, query, cb) -> cb.equal(cb.lower(root.get("category")), category.toLowerCase(Locale.ROOT));
    }

    public static Specification<Course> hasStatus(CourseStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Course> ownedBy(UUID instructorId) {
        return (root, query, cb) -> cb.equal(root.get("instructor").get("id"), instructorId);
    }
}
