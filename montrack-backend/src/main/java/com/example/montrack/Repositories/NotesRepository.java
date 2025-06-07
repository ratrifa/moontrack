package com.example.montrack.Repositories;

import com.example.montrack.Models.Notes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotesRepository extends JpaRepository<Notes, Long> {
    List<Notes> findByUser_UserId(Long userId);
}
