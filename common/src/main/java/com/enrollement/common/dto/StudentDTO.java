package com.enrollement.common.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudentDTO {
    private Long id;

    @NotBlank(message = "CNIE is required")
    private String cnie;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String email;
}
