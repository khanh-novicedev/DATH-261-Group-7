package com.class2life.mapper;

import com.class2life.dto.assessment.AssignmentResponse;
import com.class2life.dto.assessment.QuizOptionResponse;
import com.class2life.dto.assessment.QuizQuestionResponse;
import com.class2life.entity.assessment.Assignment;
import com.class2life.entity.assessment.QuizOption;
import com.class2life.entity.assessment.QuizQuestion;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class AssignmentMapper {

    public AssignmentResponse toAssignmentResponse(Assignment assignment) {
        return new AssignmentResponse(
                assignment.getId(),
                assignment.getLesson().getId(),
                assignment.getTitle(),
                assignment.getType(),
                assignment.getInstructions(),
                assignment.getPassScore(),
                assignment.getDeadline(),
                assignment.getCreatedAt(),
                assignment.getUpdatedAt()
        );
    }

    // Learner-facing view: the is_correct flag is deliberately never copied into the response
    public QuizOptionResponse toQuizOptionResponse(QuizOption option) {
        return new QuizOptionResponse(option.getId(), option.getContent());
    }

    // Groups all options of the quiz by question so the data is loaded with two queries in total
    public List<QuizQuestionResponse> toQuizQuestionResponses(List<QuizQuestion> questions, List<QuizOption> options) {
        Map<UUID, List<QuizOptionResponse>> optionsByQuestionId = new LinkedHashMap<>();
        for (QuizOption option : options) {
            optionsByQuestionId
                    .computeIfAbsent(option.getQuestion().getId(), key -> new ArrayList<>())
                    .add(toQuizOptionResponse(option));
        }

        List<QuizQuestionResponse> responses = new ArrayList<>();
        for (QuizQuestion question : questions) {
            responses.add(new QuizQuestionResponse(
                    question.getId(),
                    question.getContent(),
                    question.getPoints(),
                    optionsByQuestionId.getOrDefault(question.getId(), List.of())
            ));
        }
        return responses;
    }
}