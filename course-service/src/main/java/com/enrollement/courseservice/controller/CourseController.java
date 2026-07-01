package com.enrollement.courseservice.controller;

import com.enrollement.common.dto.CourseDTO;
import com.enrollement.courseservice.entity.Course;
import com.enrollement.courseservice.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    @Autowired private CourseService courseService;

    @PostMapping
    public Course addCourse(@RequestBody CourseDTO dto) {
        return courseService.addCourse(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(courseService.findCourseById(id));
    }

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.findAllCourse();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable("id") Long id, @RequestBody CourseDTO dto) {
        Course updated = courseService.updateCourse(id, dto);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public void deleteCourseById(@PathVariable("id") Long id) {
        courseService.deleteCourseById(id);
    }
}
