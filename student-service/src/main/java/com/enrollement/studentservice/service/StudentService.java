package com.enrollement.studentservice.service;

import com.enrollement.common.dto.StudentDTO;
import com.enrollement.studentservice.entity.Student;
import com.enrollement.studentservice.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StudentService {
    @Autowired private StudentRepository studentRepository;
    public Student addStudent(StudentDTO dto) {
        Student s=new Student();
        s.setCnie(dto.getCnie());
        s.setFirstName(dto.getFirstName());
        s.setLastName(dto.getLastName());
        s.setEmail(dto.getEmail());
        return studentRepository.save(s);
    }
    public Student modifyStudent(Long id, StudentDTO dto) {
        Student s = studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        s.setCnie(dto.getCnie());
        s.setFirstName(dto.getFirstName());
        s.setLastName(dto.getLastName());
        s.setEmail(dto.getEmail());
        return studentRepository.save(s);
    }
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
    public Student findById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }
    public List<Student> findAll() {
        return studentRepository.findAll();
    }
    public Optional<Student> findByCnie(String cnie) {
        return studentRepository.findByCnie(cnie);
    }
}