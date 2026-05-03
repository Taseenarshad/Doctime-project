package com.doctime.backendjava.controller;

import com.doctime.backendjava.dto.DoctorAppointmentResponse;
import com.doctime.backendjava.entity.Appointment;
import com.doctime.backendjava.entity.Availability;
import com.doctime.backendjava.entity.Doctor;
import com.doctime.backendjava.entity.MedicalNote;
import com.doctime.backendjava.entity.User;
import com.doctime.backendjava.repository.AppointmentRepository;
import com.doctime.backendjava.repository.AvailabilityRepository;
import com.doctime.backendjava.repository.DoctorRepository;
import com.doctime.backendjava.repository.MedicalNoteRepository;
import com.doctime.backendjava.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DoctorPortalController {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final AvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;
    private final MedicalNoteRepository medicalNoteRepository;

    public DoctorPortalController(
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository,
            AvailabilityRepository availabilityRepository,
            UserRepository userRepository,
            MedicalNoteRepository medicalNoteRepository
    ) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.availabilityRepository = availabilityRepository;
        this.userRepository = userRepository;
        this.medicalNoteRepository = medicalNoteRepository;
    }

    private Optional<Doctor> getDoctorFromUser(Long doctorUserId) {
        Optional<User> doctorUserOptional = userRepository.findById(doctorUserId);

        if (doctorUserOptional.isEmpty() || !"doctor".equals(doctorUserOptional.get().getRole())) {
            return Optional.empty();
        }

        String doctorEmail = doctorUserOptional.get().getEmail();

        return doctorRepository.findAll()
                .stream()
                .filter(d -> doctorEmail.equals(d.getEmail()))
                .findFirst();
    }

    @GetMapping("/{doctorUserId}/appointments")
    public ResponseEntity<?> getDoctorAppointments(@PathVariable Long doctorUserId) {

        Optional<Doctor> doctorOptional = getDoctorFromUser(doctorUserId);

        if (doctorOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Doctor not found"));
        }

        Doctor doctor = doctorOptional.get();
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctor.getId());

        List<DoctorAppointmentResponse> result = new ArrayList<>();

        for (Appointment appointment : appointments) {
            DoctorAppointmentResponse dto = new DoctorAppointmentResponse();
            dto.setId(appointment.getId());
            dto.setAppointmentDate(appointment.getAppointmentDate());
            dto.setAppointmentTime(appointment.getAppointmentTime());
            dto.setStatus(appointment.getStatus());
            dto.setNotes(appointment.getNotes());

            String patientName = userRepository.findById(appointment.getPatientId())
                    .map(User::getName)
                    .orElse("Unknown Patient");

            dto.setPatientName(patientName);

            result.add(dto);
        }

        return ResponseEntity.ok(Map.of(
                "doctor", doctor,
                "appointments", result
        ));
    }

    @GetMapping("/{doctorUserId}/patients")
    public ResponseEntity<?> getDoctorPatients(@PathVariable Long doctorUserId) {

        Optional<Doctor> doctorOptional = getDoctorFromUser(doctorUserId);

        if (doctorOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Doctor not found"));
        }

        Doctor doctor = doctorOptional.get();
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctor.getId());

        Map<Long, Map<String, Object>> patientsMap = new HashMap<>();

        for (Appointment appointment : appointments) {

            Long patientId = appointment.getPatientId();

            Optional<User> patientOptional = userRepository.findById(patientId);

            if (patientOptional.isEmpty()) continue;

            User patient = patientOptional.get();

            if (!patientsMap.containsKey(patientId)) {
                Map<String, Object> patientData = new HashMap<>();
                patientData.put("id", patient.getId());
                patientData.put("name", patient.getName());
                patientData.put("email", patient.getEmail());
                patientData.put("appointments", new ArrayList<>());
                patientsMap.put(patientId, patientData);
            }

            Map<String, Object> appointmentData = new HashMap<>();
            appointmentData.put("date", appointment.getAppointmentDate());
            appointmentData.put("time", appointment.getAppointmentTime());
            appointmentData.put("status", appointment.getStatus());
            appointmentData.put("notes", appointment.getNotes());

            ((List<Map<String, Object>>) patientsMap.get(patientId).get("appointments"))
                    .add(appointmentData);
        }

        return ResponseEntity.ok(Map.of(
                "patients", new ArrayList<>(patientsMap.values())
        ));
    }

    @GetMapping("/{doctorUserId}/patients/{patientId}/notes")
    public ResponseEntity<?> getMedicalNotes(
            @PathVariable Long doctorUserId,
            @PathVariable Long patientId
    ) {
        Optional<Doctor> doctorOptional = getDoctorFromUser(doctorUserId);

        if (doctorOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Doctor not found"));
        }

        Doctor doctor = doctorOptional.get();

        List<MedicalNote> notes = medicalNoteRepository.findByDoctorIdAndPatientId(
                doctor.getId(),
                patientId
        );

        return ResponseEntity.ok(Map.of("notes", notes));
    }

    @PostMapping("/{doctorUserId}/patients/{patientId}/notes")
    public ResponseEntity<?> addMedicalNote(
            @PathVariable Long doctorUserId,
            @PathVariable Long patientId,
            @RequestBody Map<String, String> request
    ) {
        Optional<Doctor> doctorOptional = getDoctorFromUser(doctorUserId);

        if (doctorOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Doctor not found"));
        }

        String noteText = request.get("note");

        if (noteText == null || noteText.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Note cannot be empty"));
        }

        MedicalNote note = new MedicalNote();
        note.setDoctorId(doctorOptional.get().getId());
        note.setPatientId(patientId);
        note.setNote(noteText);
        note.setCreatedAt(LocalDateTime.now().toString());

        medicalNoteRepository.save(note);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Medical note saved"
        ));
    }

    @GetMapping("/{doctorUserId}/availability")
    public ResponseEntity<?> getDoctorAvailability(@PathVariable Long doctorUserId) {

        Optional<Doctor> doctorOptional = getDoctorFromUser(doctorUserId);

        if (doctorOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Doctor not found"));
        }

        Doctor doctor = doctorOptional.get();
        List<Availability> availability = availabilityRepository.findByDoctorId(doctor.getId());

        return ResponseEntity.ok(Map.of(
                "doctor", doctor,
                "availability", availability
        ));
    }

    @PostMapping("/{doctorUserId}/availability")
    public ResponseEntity<?> addAvailability(
            @PathVariable Long doctorUserId,
            @RequestBody Map<String, String> request
    ) {

        Optional<Doctor> doctorOptional = getDoctorFromUser(doctorUserId);

        if (doctorOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Doctor not found"));
        }

        String availableDate = request.get("available_date");
        String availableTime = request.get("available_time");

        if (availableDate == null || availableDate.isBlank() ||
                availableTime == null || availableTime.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Both date and time are required"));
        }

        Availability slot = new Availability();
        slot.setDoctorId(doctorOptional.get().getId());
        slot.setAvailableDate(availableDate);
        slot.setAvailableTime(availableTime);
        slot.setIsBooked(false);

        availabilityRepository.save(slot);

        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/{doctorUserId}/availability/{slotId}")
    public ResponseEntity<?> deleteAvailability(
            @PathVariable Long doctorUserId,
            @PathVariable Long slotId
    ) {

        Optional<Doctor> doctorOptional = getDoctorFromUser(doctorUserId);

        if (doctorOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Doctor not found"));
        }

        Optional<Availability> slotOptional = availabilityRepository.findById(slotId);

        if (slotOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Slot not found"));
        }

        Availability slot = slotOptional.get();

        if (Boolean.TRUE.equals(slot.getIsBooked())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Booked slots cannot be deleted"));
        }

        availabilityRepository.delete(slot);

        return ResponseEntity.ok(Map.of("success", true));
    }
}