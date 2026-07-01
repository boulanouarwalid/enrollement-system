package com.enrollement.enrollementservice.controller;

import com.enrollement.enrollementservice.dto.EnrollmentRequestDTO;
import com.enrollement.enrollementservice.dto.EnrollmentResponseDTO;
import com.enrollement.enrollementservice.entity.Enrollement;
import com.enrollement.enrollementservice.service.EnrollementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollementController {

    @Autowired
    private EnrollementService enrollementService;

    @PostMapping
    public ResponseEntity<Enrollement> enrollStudent(@RequestBody EnrollmentRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollementService.enrollStudent(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enrollement> getEnrollmentById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(enrollementService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Enrollement>> getAllEnrollments() {
        return ResponseEntity.ok(enrollementService.findAll());
    }

    @GetMapping("/counts")
    public ResponseEntity<Map<Long, Long>> getEnrollmentCounts() {
        return ResponseEntity.ok(enrollementService.getEnrollmentCounts());
    }

    @GetMapping("/full")
    public ResponseEntity<List<EnrollmentResponseDTO>> getAllEnrollmentsFull() {
        return ResponseEntity.ok(enrollementService.findAllFull());
    }

    @GetMapping("/my/{cnie}")
    public ResponseEntity<List<EnrollmentResponseDTO>> getMyEnrollments(@PathVariable("cnie") String cnie) {
        return ResponseEntity.ok(enrollementService.getEnrollmentsByCnie(cnie));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable("id") Long id) {
        enrollementService.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }
}
