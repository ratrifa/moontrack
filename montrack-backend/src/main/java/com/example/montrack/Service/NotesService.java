package com.example.montrack.Service;

import com.example.montrack.DTO.ApiResponse;
import com.example.montrack.Models.Notes;
import com.example.montrack.Models.Transaction;
import com.example.montrack.Repositories.NotesRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NotesService {
    @Autowired
    private NotesRepository notesRepository;

    public ApiResponse<Notes> addNotes(Notes notes) {
        if (notes == null || notes.getUser().getUserId() == 0 || notes.getTitle() == null) {
            return new ApiResponse<>(false, "Notes data is invalid", null);
        }
        Notes savedNotes = notesRepository.save(notes);
        return new ApiResponse<>(true, "Notes added successfully", savedNotes);
    }

    public ApiResponse<List<Notes>> getAllNotes(Long userId) {
        List<Notes> notes = notesRepository.findByUser_UserId(userId);
        if (notes.isEmpty()) {
            return new ApiResponse<>(true, "No notes found", null);
        }
        return new ApiResponse<>(true, "Notes retrieved successfully", notes);
    }

    public ApiResponse<Notes> update(Long id, Notes notesData) {
        if (notesData == null) {
            return new ApiResponse<>(false, "Notes data is invalid", null);
        }

        Optional<Notes> optionalNotes = notesRepository.findById(id);

        if (optionalNotes.isEmpty()) {
            return new ApiResponse<>(false, "Notes not found", null);
        }

        Notes existingNotes = optionalNotes.get();
        existingNotes.setDescription(notesData.getDescription());
        existingNotes.setTitle(notesData.getTitle());
        existingNotes.setUser(notesData.getUser());
        Notes savedNotes = notesRepository.save(existingNotes);
        return new ApiResponse<>(true, "Notes updated successfully", savedNotes);
    }

    public ApiResponse<Void> deleteNotes(Long notesId) {
        if (!notesRepository.existsById(notesId)) {
            return new ApiResponse<>(false, "Notes not found", null);
        }
        notesRepository.deleteById(notesId);
        return new ApiResponse<>(true, "Notes deleted successfully", null);
    }
}
