package com.doctime.backendjava.repository;

import com.doctime.backendjava.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}