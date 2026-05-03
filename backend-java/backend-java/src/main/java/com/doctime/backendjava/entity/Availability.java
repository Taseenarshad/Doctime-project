package com.doctime.backendjava.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "availability")
@Data
public class Availability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("doctor_id")
    private Long doctorId;

    @JsonProperty("available_date")
    private String availableDate;

    @JsonProperty("available_time")
    private String availableTime;

    @JsonProperty("is_booked")
    private Boolean isBooked;
}