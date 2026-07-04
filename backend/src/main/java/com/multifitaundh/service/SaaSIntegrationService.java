package com.multifitaundh.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestClientException;

import java.util.List;

import com.multifitaundh.dto.MembershipPlanDto;
import com.multifitaundh.dto.ClassScheduleDto;
import tools.jackson.core.JacksonException;

@Service
public class SaaSIntegrationService {

    @Value("${saas.api.base-url}")
    private String saasApiBaseUrl;

    @Value("${saas.api.key}")
    private String saasApiKey;

    private final RestTemplate restTemplate;

    public SaaSIntegrationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<MembershipPlanDto> getMembershipPlans() {
        String url = saasApiBaseUrl + "/memberships?apiKey=" + saasApiKey;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<List<MembershipPlanDto>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<MembershipPlanDto>>() {}
            );
            return response.getBody();
        } catch (JacksonException e) {
            throw new IllegalStateException("Failed to parse membership plans response from SaaS API: " + e.getMessage(), e);
        } catch (RestClientException e) {
            throw new IllegalStateException("Failed to fetch membership plans from SaaS API: " + e.getMessage(), e);
        }
    }

    public List<ClassScheduleDto> getClassSchedule() {
        String url = saasApiBaseUrl + "/schedule?apiKey=" + saasApiKey;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<List<ClassScheduleDto>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<ClassScheduleDto>>() {}
            );
            return response.getBody();
        } catch (JacksonException e) {
            throw new IllegalStateException("Failed to parse class schedule response from SaaS API: " + e.getMessage(), e);
        } catch (RestClientException e) {
            throw new IllegalStateException("Failed to fetch class schedule from SaaS API: " + e.getMessage(), e);
        }
    }
}