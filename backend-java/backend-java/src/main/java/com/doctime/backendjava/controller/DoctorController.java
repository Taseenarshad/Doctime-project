package com.doctime.backendjava.controller;

import com.doctime.backendjava.entity.Doctor;
import com.doctime.backendjava.repository.DoctorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    public DoctorController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
}