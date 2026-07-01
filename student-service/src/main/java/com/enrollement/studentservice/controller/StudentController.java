package com.enrollement.studentservice.controller;

import com.enrollement.common.dto.StudentDTO;
import com.enrollement.studentservice.entity.Student;
import com.enrollement.studentservice.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    @Autowired private  StudentService studentService;


    @PostMapping
    public Student createStudent(@RequestBody StudentDTO dto) {
        return studentService.addStudent(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(studentService.findById(id));
    }

    @GetMapping("/by-cnie/{cnie}")
    public ResponseEntity<Optional<Student>> getStudentByCnie(@PathVariable("cnie") String cnie) {
        return ResponseEntity.ok(studentService.findByCnie(cnie));
    }

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> modifyStudent(@PathVariable("id") Long id, @RequestBody StudentDTO dto) {
        return ResponseEntity.ok(studentService.modifyStudent(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable("id") Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}