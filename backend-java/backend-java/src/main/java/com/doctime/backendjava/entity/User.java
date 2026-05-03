package com.doctime.backendjava.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String role;

    @JsonProperty("date_of_birth")
    private String dateOfBirth;

    private String gender;
    private String phone;

    @JsonProperty("emergency_contact_name")
    private String emergencyContactName;

    @JsonProperty("emergency_contact_phone")
    private String emergencyContactPhone;

    @JsonProperty("insurance_provider")
    private String insuranceProvider;

    @JsonProperty("insurance_policy_number")
    private String insurancePolicyNumber;

    @JsonProperty("email_reminders")
    private Boolean emailReminders = true;

    @JsonProperty("sms_reminders")
    private Boolean smsReminders = false;
}