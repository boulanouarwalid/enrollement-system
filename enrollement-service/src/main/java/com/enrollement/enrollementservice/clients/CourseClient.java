package com.enrollement.enrollementservice.clients;

import com.enrollement.common.dto.CourseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class CourseClient {

    private final WebClient webClient;

    @Autowired
    public CourseClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public CourseDTO getCourseById(Long courseId) {
        return webClient
                .get()
                .uri("http://course-service/api/courses/" + courseId)
                .retrieve()
                .bodyToMono(CourseDTO.class)
                .onErrorResume(ex -> Mono.empty())
                .block();
    }
}
