package com.class2life.service.course;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import com.class2life.dto.course.InstructorSummary;
import com.class2life.entity.user.User;
import com.class2life.entity.user.UserRole;
import com.class2life.repository.course.CourseSpecifications;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.class2life.common.PageResponse;
import com.class2life.dto.course.CourseCatalogResponse;
import com.class2life.dto.course.CourseResponse;
import com.class2life.dto.course.CreateCourseRequest;
import com.class2life.dto.course.CreateLessonRequest;
import com.class2life.dto.course.UpdateCourseRequest;
import com.class2life.entity.course.Course;
import com.class2life.entity.course.CourseStatus;
import com.class2life.entity.course.Lesson;
import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import com.class2life.mapper.CourseMapper;
import com.class2life.repository.course.CourseRepository;
import com.class2life.repository.course.LessonRepository;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final CourseMapper courseMapper;
    private final UserRepository userRepository;
    // Tiêm các dependency thông qua Constructor

    @Transactional
    public CourseResponse createCourse(@NonNull CreateCourseRequest request) {
        // 1. Khởi tạo và lưu Entity Course
        Course course = new Course();
        course.setTitle(request.title());
        course.setDescription(request.description());
        course.setCategory(request.category());
        course.setStatus(CourseStatus.DRAFT); // Mặc định khóa học mới tạo là DRAFT
        // Gán instructor khi Leader hoàn thành file User và tính năng đăng nhập

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User instructor = userRepository.findByEmail(email).orElseThrow(() ->
                new ApiException(ErrorCode.USER_NOT_FOUND));
        course.setInstructor(instructor);

        Course savedCourse = courseRepository.save(course);

        // 2. Xử lý danh sách Lesson lồng bên trong (nếu có)
        List<Lesson> savedLessons = new ArrayList<>();
        if (request.lessons() != null && !request.lessons().isEmpty()) {
            for (CreateLessonRequest lessonReq : request.lessons()) {
                Lesson lesson = new Lesson();
                lesson.setCourse(savedCourse);
                lesson.setSequenceNumber(lessonReq.sequenceNumber());
                lesson.setTitle(lessonReq.title());
                lesson.setType(lessonReq.type());
                lesson.setContentUrl(lessonReq.contentUrl());
                savedLessons.add(lesson);
            }
            // Lưu toàn bộ bài học vào cơ sở dữ liệu
            savedLessons = lessonRepository.saveAll(savedLessons);
        }

        // 3. Map sang Response DTO và trả về
        return courseMapper.toCourseResponse(savedCourse, savedLessons);
    }
    private static final int MAX_PAGE_SIZE = 100;

    @Transactional(readOnly = true)
    public PageResponse<CourseCatalogResponse> getCourseCatalog(String keyword, String category, CourseStatus status,
                                                                boolean mine, int page, int size) {
        if (page < 0) {
            throw new ApiException(ErrorCode.VALIDATION_ERROR, "page: must be 0 or greater");
        }
        if (size < 1) {
            throw new ApiException(ErrorCode.VALIDATION_ERROR, "size: must be 1 or greater");
        }

        UserRole role = currentRole();
        Specification<Course> spec = Specification.unrestricted();
        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and(CourseSpecifications.titleContains(keyword.trim()));
        }
        if (category != null && !category.isBlank()) {
            spec = spec.and(CourseSpecifications.hasCategory(category.trim()));
        }

        if (role == UserRole.ADMIN) {
            if (status != null) {
                spec = spec.and(CourseSpecifications.hasStatus(status));
            }
            if (mine) {
                spec = spec.and(CourseSpecifications.ownedBy(currentUser().getId()));
            }
        } else if (role == UserRole.INSTRUCTOR && mine) {
            spec = spec.and(CourseSpecifications.ownedBy(currentUser().getId()));
        } else {
            spec = spec.and(CourseSpecifications.hasStatus(CourseStatus.PUBLISHED));
        }

        Pageable pageable = PageRequest.of(page, Math.min(size, MAX_PAGE_SIZE),
                Sort.by(Sort.Direction.DESC, "createdAt").and(Sort.by("id")));
        Page<Course> coursePage = courseRepository.findAll(spec, pageable);

        List<UUID> courseIds = coursePage.getContent().stream().map(Course::getId).toList();
        Map<UUID, Long> lessonCounts = courseIds.isEmpty()
                ? Map.of()
                : lessonRepository.countByCourseIds(courseIds).stream()
                        .collect(Collectors.toMap(LessonRepository.LessonCount::getCourseId,
                                LessonRepository.LessonCount::getLessonCount));

        List<CourseCatalogResponse> items = coursePage.getContent().stream()
                .map(course -> new CourseCatalogResponse(
                        course.getId(),
                        course.getTitle(),
                        course.getDescription(),
                        course.getCategory(),
                        course.getStatus(),
                        course.getInstructor() == null
                                ? null
                                : new InstructorSummary(course.getInstructor().getId(), course.getInstructor().getFullName()),
                        lessonCounts.getOrDefault(course.getId(), 0L).intValue()
                ))
                .toList();

        return new PageResponse<>(
                items,
                coursePage.getNumber(),
                coursePage.getSize(),
                coursePage.getTotalElements(),
                coursePage.getTotalPages()
        );
    }

    private UserRole currentRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new ApiException(ErrorCode.UNAUTHORIZED, "Unauthorized");
        }
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            String name = authority.getAuthority();
            if (name != null && name.startsWith("ROLE_")) {
                try {
                    return UserRole.valueOf(name.substring("ROLE_".length()));
                } catch (IllegalArgumentException ignored) {
                }
            }
        }
        throw new ApiException(ErrorCode.FORBIDDEN, "Forbidden");
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND, "User not found"));
    }

    public CourseResponse getCourseDetails(UUID courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found")); // Đổi thành AppException sau

        // Ném 404 nếu Course là DRAFT/HIDDEN và người gọi là LEARNER

        // Thay bằng EnrolmentService.isEnrolled(userId, courseId)
        boolean isFullView = false; // Tạm fix cứng Limited View theo yêu cầu

        List<Lesson> lessons = lessonRepository.findByCourseIdOrderBySequenceNumberAsc(courseId);

        return courseMapper.toCourseResponse(course, lessons, isFullView);
    }

    @Transactional
    public CourseResponse updateCourse(UUID courseId, UpdateCourseRequest request) {
        // 1. Tìm khóa học trong kho
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found")); // AppException(404)

        // Phân quyền - Kiểm tra người dùng đăng nhập có phải Owner của khóa học không (gọi UserService)

        // 2. Cập nhật thông tin Course
        course.setTitle(request.title());
        course.setDescription(request.description());
        course.setCategory(request.category());
        // course.setPrerequisites(request.prerequisites());
        Course updatedCourse = courseRepository.save(course);

        // 3. Lấy danh sách bài học cũ từ DB
        List<Lesson> existingLessons = lessonRepository.findByCourseIdOrderBySequenceNumberAsc(courseId);
        
        // Đưa vào Map để tra cứu siêu tốc (tránh lag khi vòng lặp lồng nhau)
        java.util.Map<UUID, Lesson> existingLessonMap = existingLessons.stream()
                .collect(java.util.stream.Collectors.toMap(Lesson::getId, l -> l));
        
        List<Lesson> lessonsToSave = new ArrayList<>();

        // 4. Xử lý danh sách bài học gửi từ Frontend
        if (request.lessons() != null) {
            for (com.class2life.dto.course.UpdateLessonRequest lessonReq : request.lessons()) {
                if (lessonReq.id() != null && existingLessonMap.containsKey(lessonReq.id())) {
                    // CÓ ID và KHỚP: Cập nhật
                    Lesson lesson = existingLessonMap.get(lessonReq.id());
                    lesson.setSequenceNumber(lessonReq.sequenceNumber());
                    lesson.setTitle(lessonReq.title());
                    lesson.setType(lessonReq.type());
                    lesson.setContentUrl(lessonReq.contentUrl());
                    lessonsToSave.add(lesson);
                    
                    // Rút bài học này ra khỏi Map (Đã xử lý xong)
                    existingLessonMap.remove(lessonReq.id());
                } else {
                    // ID NULL hoặc KHÔNG KHỚP: Thêm mới hoàn toàn
                    Lesson newLesson = new Lesson();
                    newLesson.setCourse(updatedCourse);
                    newLesson.setSequenceNumber(lessonReq.sequenceNumber());
                    newLesson.setTitle(lessonReq.title());
                    newLesson.setType(lessonReq.type());
                    newLesson.setContentUrl(lessonReq.contentUrl());
                    lessonsToSave.add(newLesson);
                }
            }
        }

        // 5. Các bài học còn kẹt lại trong Map là những bài KHÔNG ĐƯỢC GỬI LÊN -> Phải Xóa
        List<Lesson> lessonsToDelete = new ArrayList<>(existingLessonMap.values());
        if (!lessonsToDelete.isEmpty()) {
            lessonRepository.deleteAll(lessonsToDelete);
        }

        // 6. Lưu toàn bộ (Sửa + Thêm mới)
        List<Lesson> finalLessons = lessonRepository.saveAll(lessonsToSave);

        // 7. Trả về kết quả (Góc nhìn Full View = true vì người sửa là Owner)
        return courseMapper.toCourseResponse(updatedCourse, finalLessons, true);
    }

    @Transactional
    public CourseResponse changeCourseStatus(UUID courseId, CourseStatus newStatus) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found")); // Ném lỗi 404

        // Kiểm tra phân quyền Owner hoặc Admin

        course.setStatus(newStatus);
        Course updatedCourse = courseRepository.save(course);
        
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderBySequenceNumberAsc(courseId);
        return courseMapper.toCourseResponse(updatedCourse, lessons, true);
    }

    @Transactional
    public void deleteCourse(UUID courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Kiểm tra phân quyền Owner
        // Gọi EnrolmentService.isEnrolled(courseId). Nếu ĐÃ CÓ học viên -> KHÔNG CHO XÓA (Ném lỗi 409 Conflict), chỉ cho phép ẩn (DRAFT/HIDDEN).

        // Bắt buộc xóa hết bài học trước khi xóa khóa học (vì dính khóa ngoại)
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderBySequenceNumberAsc(courseId);
        if (!lessons.isEmpty()) {
            lessonRepository.deleteAll(lessons);
        }
        courseRepository.delete(course);
    }

    // Used by the assessment module (modules call each other's services, never repositories)
    @Transactional(readOnly = true)
    public Lesson getLessonOrThrow(UUID lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ApiException(ErrorCode.LESSON_NOT_FOUND, "Lesson not found"));
    }

    // TODO: return true only when the lesson's course belongs to this instructor, once the Leader
    // provides the logged-in user from the SecurityContext and Course.instructor is always set.
    public boolean isLessonOwnedByInstructor(UUID lessonId, UUID instructorId) {
        return true;
    }
}