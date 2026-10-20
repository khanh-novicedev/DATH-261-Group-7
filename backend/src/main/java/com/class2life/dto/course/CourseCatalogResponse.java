package com.class2life.dto.course;

import com.class2life.entity.CourseStatus;
import java.util.UUID;

public record CourseCatalogResponse(
        UUID id,
        String title,
        String description,
        String category,
        CourseStatus status,
        UUID instructorId, // Tạm giữ ID thay vì Object Instructor vì nhánh User chưa gộp
        int lessonCount    // Chỉ trả về số lượng bài học thay vì toàn bộ danh sách
) {
}