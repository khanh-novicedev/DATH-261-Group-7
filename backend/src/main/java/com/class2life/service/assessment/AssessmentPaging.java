package com.class2life.service.assessment;

import com.class2life.exception.ApiException;
import com.class2life.exception.ErrorCode;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

// The sort is always chosen by the server, never by the client, so a client cannot sort by arbitrary fields
final class AssessmentPaging {

    private static final int MAX_PAGE_SIZE = 100;

    private AssessmentPaging() {
    }

    static PageRequest of(int page, int size, Sort sort) {
        if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) {
            throw new ApiException(ErrorCode.VALIDATION_ERROR,
                    "page must be 0 or greater and size must be between 1 and " + MAX_PAGE_SIZE);
        }
        return PageRequest.of(page, size, sort);
    }
}