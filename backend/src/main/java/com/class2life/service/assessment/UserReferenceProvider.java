package com.class2life.service.assessment;

import com.class2life.entity.user.User;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Component;

import java.util.UUID;

// TODO: UserService has no "get user by id" method yet. Ask the Leader to add one
// (for example User getUserById(UUID id) throwing USER_NOT_FOUND), then replace this class with it.
// Until then this returns a lazy reference, which is enough to fill the user foreign keys of the
// assessment tables. A non-existent id is rejected by the database foreign key on insert.
@Component
public class UserReferenceProvider {

    private final EntityManager entityManager;

    public UserReferenceProvider(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public User getReference(UUID userId) {
        return entityManager.getReference(User.class, userId);
    }
}