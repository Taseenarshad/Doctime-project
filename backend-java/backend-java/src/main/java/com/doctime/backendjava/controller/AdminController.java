package com.doctime.backendjava.controller;

import com.doctime.backendjava.dto.AdminAppointmentResponse;
import com.doctime.backendjava.entity.Appointment;
import com.doctime.backendjava.entity.Doctor;
import com.doctime.backendjava.entity.User;
import com.doctime.backendjava.repository.AppointmentRepository;
import com.doctime.backendjava.repository.DoctorRepository;
import com.doctime.backendjava.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public AdminController(
            UserRepository userRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository
    ) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/{adminUserId}/dashboard")
    public ResponseEntity<?> getAdminDashboard(@PathVariable Long adminUserId) {
        Optional<User> adminOptional = userRepository.findById(adminUserId);

        if (adminOptional.isEmpty() || !"admin".equals(adminOptional.get().getRole())) {
            return ResponseEntity.status(404).body(Map.of("message", "Admin user not found"));
        }

        List<User> users = userRepository.findAll();
        List<Doctor> doctors = doctorRepository.findAll();
        List<Appointment> appointments = appointmentRepository.findAll();

        long totalPatients = users.stream().filter(u -> "patient".equals(u.getRole())).count();
        long totalDoctors = doctors.size();
        long totalAppointments = appointments.size();
        long completedAppointments = appointments.stream()
                .filter(a -> "Completed".equals(a.getStatus()))
                .count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("total_patients", totalPatients);
        summary.put("total_doctors", totalDoctors);
        summary.put("total_appointments", totalAppointments);
        summary.put("completed_appointments", completedAppointments);

        List<AdminAppointmentResponse> appointmentList = new ArrayList<>();

        for (Appointment appointment : appointments) {
            AdminAppointmentResponse dto = new AdminAppointmentResponse();
            dto.setId(appointment.getId());
            dto.setAppointmentDate(appointment.getAppointmentDate());
            dto.setAppointmentTime(appointment.getAppointmentTime());
            dto.setStatus(appointment.getStatus());

            String patientName = userRepository.findById(appointment.getPatientId())
                    .map(User::getName).orElse("Unknown");

            String doctorName = doctorRepository.findById(appointment.getDoctorId())
                    .map(Doctor::getName).orElse("Unknown");

            dto.setPatientName(patientName);
            dto.setDoctorName(doctorName);

            appointmentList.add(dto);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("summary", summary);
        response.put("users", users);
        response.put("doctors", doctors);
        response.put("appointments", appointmentList);

        return ResponseEntity.ok(response);
    }

    // 🔥 EDIT APPOINTMENT
    @PutMapping("/{adminUserId}/appointments/{appointmentId}")
    public ResponseEntity<?> updateAppointment(
            @PathVariable Long adminUserId,
            @PathVariable Long appointmentId,
            @RequestBody Map<String, String> body
    ) {
        Optional<User> adminOptional = userRepository.findById(adminUserId);

        if (adminOptional.isEmpty() || !"admin".equals(adminOptional.get().getRole())) {
            return ResponseEntity.status(404).body(Map.of("message", "Admin not found"));
        }

        Optional<Appointment> appointmentOptional = appointmentRepository.findById(appointmentId);

        if (appointmentOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Appointment not found"));
        }

        Appointment appt = appointmentOptional.get();

        if (body.containsKey("appointment_date")) {
            appt.setAppointmentDate(body.get("appointment_date"));
        }

        if (body.containsKey("appointment_time")) {
            appt.setAppointmentTime(body.get("appointment_time"));
        }

        if (body.containsKey("status")) {
            appt.setStatus(body.get("status"));
        }

        appointmentRepository.save(appt);

        return ResponseEntity.ok(Map.of("success", true, "message", "Appointment updated"));
    }

    // 🔥 DELETE APPOINTMENT
    @DeleteMapping("/{adminUserId}/appointments/{appointmentId}")
    public ResponseEntity<?> deleteAppointment(
            @PathVariable Long adminUserId,
            @PathVariable Long appointmentId
    ) {
        Optional<User> adminOptional = userRepository.findById(adminUserId);

        if (adminOptional.isEmpty() || !"admin".equals(adminOptional.get().getRole())) {
            return ResponseEntity.status(404).body(Map.of("message", "Admin not found"));
        }

        if (!appointmentRepository.existsById(appointmentId)) {
            return ResponseEntity.status(404).body(Map.of("message", "Appointment not found"));
        }

        appointmentRepository.deleteById(appointmentId);

        return ResponseEntity.ok(Map.of("success", true, "message", "Appointment deleted"));
    }

    @DeleteMapping("/{adminUserId}/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long adminUserId, @PathVariable Long userId) {

        if (adminUserId.equals(userId)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot delete yourself"));
        }

        userRepository.deleteById(userId);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/{adminUserId}/doctors/{doctorId}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long adminUserId, @PathVariable Long doctorId) {

        doctorRepository.deleteById(doctorId);
        return ResponseEntity.ok(Map.of("success", true));
    }
}