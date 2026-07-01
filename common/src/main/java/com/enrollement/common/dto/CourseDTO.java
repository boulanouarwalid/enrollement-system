package com.enrollement.common.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CourseDTO {
    private Long id;

    @NotBlank(message = "title is required")
    private String title;

    private String description;
}

