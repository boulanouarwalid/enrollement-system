package com.enrollement.enrollementservice.clients;

import com.enrollement.common.dto.StudentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class StudentClient {

    private final WebClient webClient;

    @Autowired
    public StudentClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public StudentDTO getStudentById(Long studentId) {
        return webClient
                .get()
                .uri("http://student-service/api/students/" + studentId)
                .retrieve()
                .bodyToMono(StudentDTO.class)
                .onErrorResume(ex -> Mono.empty())
                .block();
    }

    public StudentDTO getStudentByCnie(String cnie) {
        return webClient
                .get()
                .uri("http://student-service/api/students/by-cnie/" + cnie)
                .retrieve()
                .bodyToMono(StudentDTO.class)
                .onErrorResume(ex -> Mono.empty())
                .block();
    }
}
