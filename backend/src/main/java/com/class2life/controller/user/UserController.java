package com.class2life.controller.user;

import com.class2life.common.ApiResponse;
import com.class2life.common.PageResponse;
import com.class2life.dto.user.UserFilter;
import com.class2life.dto.user.UserSummaryResponse;
import com.class2life.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
