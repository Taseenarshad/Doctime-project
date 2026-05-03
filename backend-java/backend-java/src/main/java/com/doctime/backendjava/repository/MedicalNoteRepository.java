package com.doctime.backendjava.repository;

import com.doctime.backendjava.entity.MedicalNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalNoteRepository extends JpaRepository<MedicalNote, Long> {
    List<MedicalNote> findByDoctorIdAndPatientId(Long doctorId, Long patientId);
}