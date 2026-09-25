package com.digitallibrary.backend.controller;

import com.digitallibrary.backend.entity.Book;
import com.digitallibrary.backend.repository.BookRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController

@RequestMapping("/api/books")
public class BookController {

    private final BookRepository bookRepository;

    @Autowired
    public BookController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @GetMapping
    public List<Book> getAllBooks(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        if (search != null && !search.isBlank()) {
            return bookRepository.findByTitleContainingIgnoreCase(search);
        }

        if (category != null && !category.isBlank()) {
            return bookRepository.findByCategory(category);
        }

        return bookRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Book> addBook(@Valid @RequestBody Book book) {
        Book saved = bookRepository.save(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody Book updated
    ) {
        return bookRepository.findById(id)
                .map(existing -> {
                    updated.setId(existing.getId());
                    Book saved = bookRepository.save(updated);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (!bookRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        bookRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}