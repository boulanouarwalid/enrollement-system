package com.enrollement.courseservice.service;



import com.enrollement.common.dto.CourseDTO;
import com.enrollement.courseservice.entity.Course;
import com.enrollement.courseservice.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    public Course addCourse(CourseDTO dto) {
        Course c = new Course();
        c.setDescription(dto.getDescription());
        c.setTitle(dto.getTitle());
        return courseRepository.save(c);
    }

    public Course updateCourse(Long id, CourseDTO dto) {
        Course c = courseRepository.findById(id).orElse(null);
        if (c == null) return null;
        c.setDescription(dto.getDescription());
        c.setTitle(dto.getTitle());
        return courseRepository.save(c);
    }

    public void deleteCourseById(Long id) {
        courseRepository.deleteById(id);
    }

    public Course findCourseById(Long id) {
        return courseRepository.findById(id).orElse(null);
    }

    public List<Course> findAllCourse() {
        return courseRepository.findAll();
    }
}
