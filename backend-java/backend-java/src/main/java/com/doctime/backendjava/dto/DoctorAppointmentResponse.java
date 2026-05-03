package com.doctime.backendjava.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DoctorAppointmentResponse {

    private Long id;

    @JsonProperty("patient_name")
    private String patientName;

    @JsonProperty("appointment_date")
    private String appointmentDate;

    @JsonProperty("appointment_time")
    private String appointmentTime;

    private String status;
    private String notes;
}