package com.class2life.controller.user;

import com.class2life.common.ApiResponse;
import com.class2life.common.PageResponse;
import com.class2life.dto.user.*;
import com.class2life.entity.user.UserStatus;
import com.class2life.service.user.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @GetMapping
    public ApiResponse<PageResponse<UserSummaryResponse>> getUsers(@Valid @ModelAttribute UserFilter userFilter,
                                                                   @PageableDefault(size = 20) Pageable pageable){
        return new ApiResponse<>(true, "Users Retrieved Sucessfully", userService.getUsers(userFilter, pageable));
    }
    @GetMapping("/me")
    public ApiResponse<UserSummaryResponse> getMe(){
        return new ApiResponse<>(true, "Self User Retrieved Successfully", userService.getMe());
    }
    @PutMapping("/me")
    public ApiResponse<UserSummaryResponse> updateMe(@Valid @RequestBody UpdateProfileRequest request){
        return new ApiResponse<>(true, "Self User Updated Successfully", userService.updateMe(request));
    }
    @PatchMapping("/{userId}/status")
    public ApiResponse<UpdateUserStatusResponse> updateUserStatus(@PathVariable UUID userId, @Valid @RequestBody UpdateUserStatusRequest request){
        return new ApiResponse<>(true, "User Status Updated", userService.changeStatus(userId, request) );
    }
    @GetMapping("/{userId}")
    public ApiResponse<UserSummaryResponse> getUser(@PathVariable UUID userId){
        return new ApiResponse<>(true, "User Get By Id Successfully", userService.findById(userId));
    }
}
