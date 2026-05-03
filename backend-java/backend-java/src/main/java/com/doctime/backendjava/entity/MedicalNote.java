package com.doctime.backendjava.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "medical_notes")
@Data
public class MedicalNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("doctor_id")
    private Long doctorId;

    @JsonProperty("patient_id")
    private Long patientId;

    private String note;

    @JsonProperty("created_at")
    private String createdAt;
}