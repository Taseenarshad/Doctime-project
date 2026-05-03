package com.doctime.backendjava.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AdminAppointmentResponse {

    private Long id;

    @JsonProperty("patient_name")
    private String patientName;

    @JsonProperty("doctor_name")
    private String doctorName;

    @JsonProperty("appointment_date")
    private String appointmentDate;

    @JsonProperty("appointment_time")
    private String appointmentTime;

    private String status;
}