package com.example.montrack.Controller;

import com.example.montrack.DTO.ApiResponse;
import com.example.montrack.Models.Notes;
import com.example.montrack.Service.NotesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NotesController {
    @Autowired
    private NotesService notesService;

    @PostMapping
    public ResponseEntity<ApiResponse<Notes>> addNotes(@RequestBody Notes notes) {
        ApiResponse<Notes> response = notesService.addNotes(notes);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(400).body(response);
        }
    }

    @DeleteMapping("/{notesId}")
    public ResponseEntity<ApiResponse<Void>> deleteNotes(@PathVariable Long notesId) {
        ApiResponse<Void> response = notesService.deleteNotes(notesId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(400).body(response);
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<Notes>>> getAllNotes(@PathVariable Long userId) {
        ApiResponse<List<Notes>> response = notesService.getAllNotes(userId);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(400).body(response);
        }
    }

    @PutMapping("/{notesId}")
    public ResponseEntity<ApiResponse<Notes>> updateUser(@PathVariable Long notesId, @RequestBody Notes updatedNotes) {
        ApiResponse<Notes> response = notesService.update(notesId, updatedNotes);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(400).body(response);
        }
    }
}
