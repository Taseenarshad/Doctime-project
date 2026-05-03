package com.doctime.backendjava.controller;

import com.doctime.backendjava.dto.BookAppointmentRequest;
import com.doctime.backendjava.entity.Appointment;
import com.doctime.backendjava.entity.Availability;
import com.doctime.backendjava.repository.AppointmentRepository;
import com.doctime.backendjava.repository.AvailabilityRepository;
import com.doctime.backendjava.repository.DoctorRepository;
import com.doctime.backendjava.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final AvailabilityRepository availabilityRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public AppointmentController(
            AppointmentRepository appointmentRepository,
            AvailabilityRepository availabilityRepository,
            DoctorRepository doctorRepository,
            UserRepository userRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.availabilityRepository = availabilityRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> bookAppointment(@RequestBody BookAppointmentRequest request) {
        if (!doctorRepository.existsById(request.getDoctor_id())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Doctor not found");
            return ResponseEntity.status(404).body(response);
        }

        if (!userRepository.existsById(request.getPatient_id())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Patient not found");
            return ResponseEntity.status(404).body(response);
        }

        Optional<Availability> optionalAvailability = availabilityRepository.findById(request.getAvailability_id());

        if (optionalAvailability.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Availability slot not found");
            return ResponseEntity.status(404).body(response);
        }

        Availability slot = optionalAvailability.get();

        if (Boolean.TRUE.equals(slot.getIsBooked())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "This time slot is already booked");
            return ResponseEntity.status(400).body(response);
        }

        Appointment appointment = new Appointment();
        appointment.setDoctorId(request.getDoctor_id());
        appointment.setPatientId(request.getPatient_id());
        appointment.setAvailabilityId(request.getAvailability_id());
        appointment.setAppointmentDate(slot.getAvailableDate());
        appointment.setAppointmentTime(slot.getAvailableTime());
        appointment.setStatus("Booked");
        appointment.setNotes(request.getNotes());

        appointmentRepository.save(appointment);

        slot.setIsBooked(true);
        availabilityRepository.save(slot);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Appointment booked successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{appointmentId}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long appointmentId) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(appointmentId);

        if (optionalAppointment.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Appointment not found");
            return ResponseEntity.status(404).body(response);
        }

        Appointment appointment = optionalAppointment.get();
        appointment.setStatus("Cancelled");
        appointmentRepository.save(appointment);

        if (appointment.getAvailabilityId() != null) {
            Optional<Availability> optionalAvailability = availabilityRepository.findById(appointment.getAvailabilityId());
            if (optionalAvailability.isPresent()) {
                Availability slot = optionalAvailability.get();
                slot.setIsBooked(false);
                availabilityRepository.save(slot);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Appointment cancelled successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{appointmentId}/complete")
    public ResponseEntity<?> completeAppointment(@PathVariable Long appointmentId) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(appointmentId);

        if (optionalAppointment.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Appointment not found");
            return ResponseEntity.status(404).body(response);
        }

        Appointment appointment = optionalAppointment.get();
        appointment.setStatus("Completed");
        appointmentRepository.save(appointment);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Appointment marked as completed");
        return ResponseEntity.ok(response);
    }
}