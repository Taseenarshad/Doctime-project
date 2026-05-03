package com.doctime.backendjava.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "doctors")
@Data
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String specialty;
    private String clinic;
    private String location;
    private String phone;
    private String email;
    private String bio;
    private Double rating;

    @JsonProperty("license_number")
    private String licenseNumber;

    private String certifications;

    private String affiliation;
}