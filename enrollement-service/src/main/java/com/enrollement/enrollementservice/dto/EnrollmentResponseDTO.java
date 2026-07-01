package com.enrollement.enrollementservice.dto;

import lombok.Data;

@Data
public class EnrollmentResponseDTO {

    private Long enrollmentId;
    private Long courseId;
    private String studentCnie;
    private String courseName;
    private String date;
    private boolean deletable;

}
