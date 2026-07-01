package com.enrollement.enrollementservice.service;

import com.enrollement.common.dto.CourseDTO;
import com.enrollement.common.dto.StudentDTO;
import com.enrollement.enrollementservice.clients.CourseClient;
import com.enrollement.enrollementservice.clients.StudentClient;
import com.enrollement.enrollementservice.dto.EnrollmentRequestDTO;
import com.enrollement.enrollementservice.dto.EnrollmentResponseDTO;
import com.enrollement.enrollementservice.entity.Enrollement;
import com.enrollement.enrollementservice.repository.EnrollementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class EnrollementService {

    @Autowired
    private EnrollementRepository enrollementRepository;

    @Autowired
    private StudentClient studentClient;

    @Autowired
    private CourseClient courseClient;

    public Enrollement enrollStudent(EnrollmentRequestDTO dto) {
        StudentDTO student = studentClient.getStudentById(dto.getStudentId());
        if (student == null) {
            throw new RuntimeException("Student with id " + dto.getStudentId() + " does not exist");
        }

        CourseDTO course = courseClient.getCourseById(dto.getCourseId());
        if (course == null) {
            throw new RuntimeException("Course with id " + dto.getCourseId() + " does not exist");
        }

        long count = enrollementRepository.countByCourseId(dto.getCourseId());
        if (count >= 3) {
            throw new RuntimeException("Course with id " + dto.getCourseId() + " already has 3 enrolled students");
        }

        Enrollement e = new Enrollement();
        e.setStudentId(dto.getStudentId());
        e.setCourseId(dto.getCourseId());
        e.setEnrollmentDate(LocalDateTime.now());
        return enrollementRepository.save(e);
    }

    public Enrollement findById(Long id) {
        return enrollementRepository.findById(id).orElse(null);
    }

    public List<Enrollement> findAll() {
        return enrollementRepository.findAll();
    }

    public List<EnrollmentResponseDTO> findAllFull() {
        List<Enrollement> enrollments = enrollementRepository.findAll();
        return enrollments.stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public Map<Long, Long> getEnrollmentCounts() {
        return enrollementRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(Enrollement::getCourseId, Collectors.counting()));
    }

    public List<EnrollmentResponseDTO> getEnrollmentsByCnie(String cnie) {
        StudentDTO student = studentClient.getStudentByCnie(cnie);
        if (student == null || student.getId() == null) {
            throw new RuntimeException("Student with CNIE " + cnie + " does not exist");
        }
        List<Enrollement> enrollments = enrollementRepository.findByStudentId(student.getId());
        return enrollments.stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public void deleteEnrollment(Long id) {
        Enrollement e = enrollementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + id));
        if (e.getEnrollmentDate().plusHours(24).isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot cancel enrollment older than 24 hours");
        }
        enrollementRepository.deleteById(id);
    }

    private EnrollmentResponseDTO toResponseDTO(Enrollement e) {
        EnrollmentResponseDTO dto = new EnrollmentResponseDTO();
        dto.setEnrollmentId(e.getId());
        dto.setCourseId(e.getCourseId());
        dto.setDate(e.getEnrollmentDate().toString());

        StudentDTO student = studentClient.getStudentById(e.getStudentId());
        dto.setStudentCnie(student != null ? student.getCnie() : "N/A");

        CourseDTO course = courseClient.getCourseById(e.getCourseId());
        dto.setCourseName(course != null ? course.getTitle() : "N/A");

        dto.setDeletable(e.getEnrollmentDate().plusHours(24).isAfter(LocalDateTime.now()));
        return dto;
    }
}
