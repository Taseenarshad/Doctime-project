package com.doctime.backendjava.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PatientAppointmentResponse {

    private Long id;

    @JsonProperty("appointment_date")
    private String appointmentDate;

    @JsonProperty("appointment_time")
    private String appointmentTime;

    private String status;
    private String notes;

    @JsonProperty("doctor_name")
    private String doctorName;

    @JsonProperty("doctor_specialty")
    private String doctorSpecialty;

    @JsonProperty("clinic_name")
    private String clinicName;

    @JsonProperty("doctor_location")
    private String doctorLocation;
}