package com.doctime.backendjava.controller;

import com.doctime.backendjava.entity.Doctor;
import com.doctime.backendjava.entity.User;
import com.doctime.backendjava.repository.DoctorRepository;
import com.doctime.backendjava.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProfileController {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public ProfileController(
            UserRepository userRepository,
            DoctorRepository doctorRepository
    ) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        User user = userOptional.get();

        if ("doctor".equals(user.getRole())) {
            Optional<Doctor> doctorOptional = doctorRepository.findAll()
                    .stream()
                    .filter(doctor -> user.getEmail().equals(doctor.getEmail()))
                    .findFirst();

            return ResponseEntity.ok(Map.of(
                    "profile", user,
                    "doctor_profile", doctorOptional.orElse(null)
            ));
        }

        return ResponseEntity.ok(Map.of("profile", user));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestBody User updatedProfile
    ) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        User user = userOptional.get();

        user.setName(updatedProfile.getName());
        user.setEmail(updatedProfile.getEmail());
        user.setDateOfBirth(updatedProfile.getDateOfBirth());
        user.setGender(updatedProfile.getGender());
        user.setPhone(updatedProfile.getPhone());
        user.setEmergencyContactName(updatedProfile.getEmergencyContactName());
        user.setEmergencyContactPhone(updatedProfile.getEmergencyContactPhone());
        user.setInsuranceProvider(updatedProfile.getInsuranceProvider());
        user.setInsurancePolicyNumber(updatedProfile.getInsurancePolicyNumber());
        user.setEmailReminders(updatedProfile.getEmailReminders());
        user.setSmsReminders(updatedProfile.getSmsReminders());

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Profile updated successfully",
                "profile", user
        ));
    }

    @PutMapping("/{userId}/doctor")
    public ResponseEntity<?> updateDoctorProfile(
            @PathVariable Long userId,
            @RequestBody Doctor updatedDoctorProfile
    ) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty() || !"doctor".equals(userOptional.get().getRole())) {
            return ResponseEntity.status(404).body(Map.of("message", "Doctor user not found"));
        }

        User user = userOptional.get();

        Optional<Doctor> doctorOptional = doctorRepository.findAll()
                .stream()
                .filter(doctor -> user.getEmail().equals(doctor.getEmail()))
                .findFirst();

        if (doctorOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Doctor profile not found"));
        }

        Doctor doctor = doctorOptional.get();

        doctor.setName(updatedDoctorProfile.getName());
        doctor.setEmail(updatedDoctorProfile.getEmail());
        doctor.setPhone(updatedDoctorProfile.getPhone());
        doctor.setSpecialty(updatedDoctorProfile.getSpecialty());
        doctor.setClinic(updatedDoctorProfile.getClinic());
        doctor.setLocation(updatedDoctorProfile.getLocation());
        doctor.setBio(updatedDoctorProfile.getBio());
        doctor.setLicenseNumber(updatedDoctorProfile.getLicenseNumber());
        doctor.setCertifications(updatedDoctorProfile.getCertifications());
        doctor.setAffiliation(updatedDoctorProfile.getAffiliation());

        doctorRepository.save(doctor);

        user.setName(updatedDoctorProfile.getName());
        user.setEmail(updatedDoctorProfile.getEmail());
        user.setPhone(updatedDoctorProfile.getPhone());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Doctor profile updated successfully",
                "doctor_profile", doctor,
                "profile", user
        ));
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<?> updatePassword(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request
    ) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        String currentPassword = request.get("current_password");
        String newPassword = request.get("new_password");

        User user = userOptional.get();

        if (currentPassword == null || newPassword == null ||
                currentPassword.isBlank() || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Both current and new password are required"));
        }

        if (!user.getPassword().equals(currentPassword)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Current password is incorrect"));
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password updated successfully"
        ));
    }
}