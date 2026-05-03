package com.doctime.backendjava.dto;

import lombok.Data;

@Data
public class BookAppointmentRequest {
    private Long doctor_id;
    private Long patient_id;
    private Long availability_id;
    private String notes;
}