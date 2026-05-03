package com.doctime.backendjava.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "appointments")
@Data
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long doctorId;
    private Long patientId;
    private Long availabilityId;
    private String appointmentDate;
    private String appointmentTime;
    private String status;
    private String notes;
}