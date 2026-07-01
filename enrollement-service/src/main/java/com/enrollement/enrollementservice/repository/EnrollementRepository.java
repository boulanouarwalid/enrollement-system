package com.enrollement.enrollementservice.repository;

import com.enrollement.enrollementservice.entity.Enrollement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EnrollementRepository extends JpaRepository<Enrollement, Long> {
    long countByCourseId(Long courseId);
    List<Enrollement> findByStudentId(Long studentId);
}
