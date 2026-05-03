package com.doctime.backendjava.repository;

import com.doctime.backendjava.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByDoctorId(Long doctorId);
}