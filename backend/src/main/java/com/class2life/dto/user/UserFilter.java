package com.class2life.dto.user;

import com.class2life.entity.user.UserRole;
import com.class2life.entity.user.UserStatus;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserFilter{
    private UserRole role;

    private UserStatus status;

    @Size(max = 100)
    private String keyword;

}
