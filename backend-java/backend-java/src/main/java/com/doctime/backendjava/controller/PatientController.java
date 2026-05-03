package com.doctime.backendjava.controller;

import com.doctime.backendjava.dto.PatientAppointmentResponse;
import com.doctime.backendjava.entity.Appointment;
import com.doctime.backendjava.entity.Doctor;
import com.doctime.backendjava.entity.User;
import com.doctime.backendjava.repository.AppointmentRepository;
import com.doctime.backendjava.repository.DoctorRepository;
import com.doctime.backendjava.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/patient")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PatientController {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;

    public PatientController(
            UserRepository userRepository,
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository
    ) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping("/{patientId}/appointments")
    public Map<String, Object> getPatientAppointments(@PathVariable Long patientId) {
        Optional<User> patientOptional = userRepository.findById(patientId);

        if (patientOptional.isEmpty() || !"patient".equals(patientOptional.get().getRole())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Patient not found");
            return response;
        }

        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        List<PatientAppointmentResponse> result = new ArrayList<>();

        for (Appointment appointment : appointments) {
            Optional<Doctor> doctorOptional = doctorRepository.findById(appointment.getDoctorId());
            if (doctorOptional.isEmpty()) continue;

            Doctor doctor = doctorOptional.get();

            PatientAppointmentResponse dto = new PatientAppointmentResponse();
            dto.setId(appointment.getId());
            dto.setAppointmentDate(appointment.getAppointmentDate());
            dto.setAppointmentTime(appointment.getAppointmentTime());
            dto.setStatus(appointment.getStatus());
            dto.setNotes(appointment.getNotes());
            dto.setDoctorName(doctor.getName());
            dto.setDoctorSpecialty(doctor.getSpecialty());
            dto.setClinicName(doctor.getClinic());
            dto.setDoctorLocation(doctor.getLocation());

            result.add(dto);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("appointments", result);
        return response;
    }
}