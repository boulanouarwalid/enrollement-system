package com.enrollement.studentservice.repository;


import com.enrollement.studentservice.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByCnie(String cnie);
}