package com.doctime.backendjava.config;

import com.doctime.backendjava.entity.Appointment;
import com.doctime.backendjava.entity.Availability;
import com.doctime.backendjava.entity.Doctor;
import com.doctime.backendjava.entity.Message;
import com.doctime.backendjava.entity.User;
import com.doctime.backendjava.repository.AppointmentRepository;
import com.doctime.backendjava.repository.AvailabilityRepository;
import com.doctime.backendjava.repository.DoctorRepository;
import com.doctime.backendjava.repository.MessageRepository;
import com.doctime.backendjava.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadDoctors(
            DoctorRepository doctorRepository,
            UserRepository userRepository,
            AppointmentRepository appointmentRepository,
            AvailabilityRepository availabilityRepository,
            MessageRepository messageRepository
    ) {
        return args -> {

            if (userRepository.count() == 0) {
                createUser(userRepository, "Patient User", "patient@test.com", "123456", "patient");
                createUser(userRepository, "Admin User", "admin@test.com", "123456", "admin");

                createUser(userRepository, "Dr. Sarah Johnson", "sarah.johnson@doctime.com", "123456", "doctor");
                createUser(userRepository, "Dr. Michael Chen", "michael.chen@doctime.com", "123456", "doctor");
                createUser(userRepository, "Dr. Emily Rodriguez", "emily.rodriguez@doctime.com", "123456", "doctor");
                createUser(userRepository, "Dr. David Patel", "david.patel@doctime.com", "123456", "doctor");
                createUser(userRepository, "Dr. Laura Smith", "laura.smith@doctime.com", "123456", "doctor");
                createUser(userRepository, "Dr. James Walker", "james.walker@doctime.com", "123456", "doctor");
                createUser(userRepository, "Dr. Nina Brooks", "nina.brooks@doctime.com", "123456", "doctor");
                createUser(userRepository, "Dr. Olivia Turner", "olivia.turner@doctime.com", "123456", "doctor");
                createUser(userRepository, "Dr. Ethan Murphy", "ethan.murphy@doctime.com", "123456", "doctor");
                createUser(userRepository, "Dr. Sophia Bennett", "sophia.bennett@doctime.com", "123456", "doctor");
                createUser(userRepository, "Dr. Marcus Reed", "marcus.reed@doctime.com", "123456", "doctor");
                createUser(userRepository, "Dr. Priya Nair", "priya.nair@doctime.com", "123456", "doctor");
            }

            if (doctorRepository.count() == 0) {
                doctorRepository.save(createDoctor(
                        "Dr. Sarah Johnson",
                        "Cardiology",
                        "HeartCare Medical Center",
                        "Dallas, TX",
                        "214-555-1001",
                        "sarah.johnson@doctime.com",
                        4.8
                ));

                doctorRepository.save(createDoctor(
                        "Dr. Michael Chen",
                        "Dermatology",
                        "Skin Health Clinic",
                        "Houston, TX",
                        "713-555-2002",
                        "michael.chen@doctime.com",
                        4.7
                ));

                doctorRepository.save(createDoctor(
                        "Dr. Emily Rodriguez",
                        "Pediatrics",
                        "Sunrise Children's Clinic",
                        "Austin, TX",
                        "512-555-3003",
                        "emily.rodriguez@doctime.com",
                        4.9
                ));

                doctorRepository.save(createDoctor(
                        "Dr. David Patel",
                        "Neurology",
                        "Advanced Neuro Specialists",
                        "San Antonio, TX",
                        "210-555-4004",
                        "david.patel@doctime.com",
                        4.6
                ));

                doctorRepository.save(createDoctor(
                        "Dr. Laura Smith",
                        "General Practice",
                        "Community Health Partners",
                        "Fort Worth, TX",
                        "817-555-5005",
                        "laura.smith@doctime.com",
                        4.8
                ));

                doctorRepository.save(createDoctor(
                        "Dr. James Walker",
                        "Orthopedics",
                        "Premier Bone & Joint Center",
                        "El Paso, TX",
                        "915-555-6006",
                        "james.walker@doctime.com",
                        4.7
                ));

                doctorRepository.save(createDoctor(
                        "Dr. Nina Brooks",
                        "Psychiatry",
                        "MindWell Behavioral Health",
                        "Plano, TX",
                        "972-555-7007",
                        "nina.brooks@doctime.com",
                        4.8
                ));

                doctorRepository.save(createDoctor(
                        "Dr. Olivia Turner",
                        "Ophthalmology",
                        "ClearView Eye Institute",
                        "Irving, TX",
                        "469-555-8008",
                        "olivia.turner@doctime.com",
                        4.9
                ));

                doctorRepository.save(createDoctor(
                        "Dr. Ethan Murphy",
                        "ENT",
                        "North Texas ENT Associates",
                        "Arlington, TX",
                        "682-555-9009",
                        "ethan.murphy@doctime.com",
                        4.6
                ));

                doctorRepository.save(createDoctor(
                        "Dr. Sophia Bennett",
                        "Gynecology",
                        "Women's Wellness Clinic",
                        "Frisco, TX",
                        "214-555-1010",
                        "sophia.bennett@doctime.com",
                        4.8
                ));

                doctorRepository.save(createDoctor(
                        "Dr. Marcus Reed",
                        "Oncology",
                        "Hope Cancer Center",
                        "McKinney, TX",
                        "469-555-1111",
                        "marcus.reed@doctime.com",
                        4.7
                ));

                doctorRepository.save(createDoctor(
                        "Dr. Priya Nair",
                        "Endocrinology",
                        "Metro Endocrine Specialists",
                        "Richardson, TX",
                        "972-555-1212",
                        "priya.nair@doctime.com",
                        4.9
                ));
            }

            if (availabilityRepository.count() == 0) {
                addAvailabilityForDoctor(doctorRepository, availabilityRepository,
                        "Dr. Sarah Johnson", "2026-04-25", "09:00 AM");
                addAvailabilityForDoctor(doctorRepository, availabilityRepository,
                        "Dr. Sarah Johnson", "2026-04-25", "10:00 AM");
                addAvailabilityForDoctor(doctorRepository, availabilityRepository,
                        "Dr. Sarah Johnson", "2026-04-25", "11:00 AM");

                addAvailabilityForDoctor(doctorRepository, availabilityRepository,
                        "Dr. Michael Chen", "2026-04-26", "09:00 AM");
                addAvailabilityForDoctor(doctorRepository, availabilityRepository,
                        "Dr. Michael Chen", "2026-04-26", "10:00 AM");

                addAvailabilityForDoctor(doctorRepository, availabilityRepository,
                        "Dr. Emily Rodriguez", "2026-04-27", "01:00 PM");
                addAvailabilityForDoctor(doctorRepository, availabilityRepository,
                        "Dr. David Patel", "2026-04-28", "02:00 PM");
                addAvailabilityForDoctor(doctorRepository, availabilityRepository,
                        "Dr. Laura Smith", "2026-04-29", "03:00 PM");
                addAvailabilityForDoctor(doctorRepository, availabilityRepository,
                        "Dr. James Walker", "2026-04-30", "11:00 AM");
                addAvailabilityForDoctor(doctorRepository, availabilityRepository,
                        "Dr. Nina Brooks", "2026-05-01", "12:00 PM");
                addAvailabilityForDoctor(doctorRepository, availabilityRepository,
                        "Dr. Olivia Turner", "2026-05-02", "09:30 AM");
                addAvailabilityForDoctor(doctorRepository, availabilityRepository,
                        "Dr. Ethan Murphy", "2026-05-03", "10:30 AM");
                addAvailabilityForDoctor(doctorRepository, availabilityRepository,
                        "Dr. Sophia Bennett", "2026-05-04", "01:30 PM");
                addAvailabilityForDoctor(doctorRepository, availabilityRepository,
                        "Dr. Marcus Reed", "2026-05-05", "02:30 PM");
                addAvailabilityForDoctor(doctorRepository, availabilityRepository,
                        "Dr. Priya Nair", "2026-05-06", "03:30 PM");
            }

            if (appointmentRepository.count() == 0) {
                Appointment appointment = new Appointment();
                appointment.setDoctorId(1L);
                appointment.setPatientId(1L);
                appointment.setAvailabilityId(null);
                appointment.setAppointmentDate("2026-04-30");
                appointment.setAppointmentTime("10:00 AM");
                appointment.setStatus("Booked");
                appointment.setNotes("General checkup");
                appointmentRepository.save(appointment);
            }

            if (messageRepository.count() == 0) {
                Message m1 = new Message();
                m1.setSenderId(3L);
                m1.setSenderRole("doctor");
                m1.setReceiverId(1L);
                m1.setReceiverRole("patient");
                m1.setContent("Hello, please arrive 10 minutes early for your appointment.");
                m1.setCreatedAt("2026-04-23T09:00:00");
                messageRepository.save(m1);

                Message m2 = new Message();
                m2.setSenderId(1L);
                m2.setSenderRole("patient");
                m2.setReceiverId(3L);
                m2.setReceiverRole("doctor");
                m2.setContent("Thank you doctor, I will be there on time.");
                m2.setCreatedAt("2026-04-23T09:05:00");
                messageRepository.save(m2);
            }
        };
    }

    private User createUser(
            UserRepository userRepository,
            String name,
            String email,
            String password,
            String role
    ) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        return userRepository.save(user);
    }

    private Doctor createDoctor(
            String name,
            String specialty,
            String clinic,
            String location,
            String phone,
            String email,
            Double rating
    ) {
        Doctor doctor = new Doctor();
        doctor.setName(name);
        doctor.setSpecialty(specialty);
        doctor.setClinic(clinic);
        doctor.setLocation(location);
        doctor.setPhone(phone);
        doctor.setEmail(email);
        doctor.setRating(rating);
        return doctor;
    }

    private void addAvailabilityForDoctor(
            DoctorRepository doctorRepository,
            AvailabilityRepository availabilityRepository,
            String doctorName,
            String date,
            String time
    ) {
        Optional<Doctor> doctorOptional = doctorRepository.findAll()
                .stream()
                .filter(d -> doctorName.equals(d.getName()))
                .findFirst();

        if (doctorOptional.isPresent()) {
            Availability availability = new Availability();
            availability.setDoctorId(doctorOptional.get().getId());
            availability.setAvailableDate(date);
            availability.setAvailableTime(time);
            availability.setIsBooked(false);
            availabilityRepository.save(availability);
        }
    }
}