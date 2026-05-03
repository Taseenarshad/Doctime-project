package com.doctime.backendjava.controller;

import com.doctime.backendjava.entity.Availability;
import com.doctime.backendjava.repository.AvailabilityRepository;
import com.doctime.backendjava.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AvailabilityController {

    private final AvailabilityRepository availabilityRepository;
    private final DoctorRepository doctorRepository;

    public AvailabilityController(
            AvailabilityRepository availabilityRepository,
            DoctorRepository doctorRepository
    ) {
        this.availabilityRepository = availabilityRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping("/{doctorId}/availability")
    public ResponseEntity<?> getDoctorAvailability(@PathVariable Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Doctor not found");
            return ResponseEntity.status(404).body(response);
        }

        List<Availability> slots = availabilityRepository.findByDoctorId(doctorId);

        Map<String, Object> response = new HashMap<>();
        response.put("availability", slots);
        return ResponseEntity.ok(response);
    }
}