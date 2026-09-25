package com.digitallibrary.backend.controller;

import com.digitallibrary.backend.dto.WishlistRequest;
import org.springframework.transaction.annotation.Transactional;
import com.digitallibrary.backend.entity.Book;
import com.digitallibrary.backend.entity.User;
import com.digitallibrary.backend.entity.WishlistItem;
import com.digitallibrary.backend.repository.BookRepository;
import com.digitallibrary.backend.repository.UserRepository;
import com.digitallibrary.backend.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
//@CrossOrigin(origins = {
//        "http://localhost:5173",
//        "http://localhost:5174",
//        "http://localhost:5175",
//        "http://localhost:5176",
//        "http://localhost:5177",
//        "http://localhost:5178"
//})
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Autowired
    public WishlistController(WishlistRepository wishlistRepository, UserRepository userRepository, BookRepository bookRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    /**
     * GET /api/wishlist/user/{userId}
     * Every book this specific user has saved -- this is what makes
     * the wishlist different per user: it's always filtered by
     * whichever userId is passed in.
     */
    @GetMapping("/user/{userId}")
    public List<WishlistItem> getWishlist(@PathVariable Long userId) {
        return wishlistRepository.findByUserId(userId);
    }

    /**
     * GET /api/wishlist/check?userId=1&bookId=4
     * Used by the Book Detail page on load, to decide whether the
     * heart icon should start filled in or not.
     */
    @GetMapping("/check")
    public Map<String, Boolean> isWishlisted(@RequestParam Long userId, @RequestParam Long bookId) {
        boolean exists = wishlistRepository.existsByUserIdAndBookId(userId, bookId);
        return Map.of("wishlisted", exists);
    }

    /**
     * POST /api/wishlist
     * Body: { "userId": 1, "bookId": 4 }
     */
    @PostMapping
    public ResponseEntity<?> addToWishlist(@RequestBody WishlistRequest request) {
        if (wishlistRepository.existsByUserIdAndBookId(request.getUserId(), request.getBookId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Already in wishlist");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        WishlistItem saved = wishlistRepository.save(new WishlistItem(user, book));
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * DELETE /api/wishlist/user/{userId}/book/{bookId}
     */
    @Transactional
    @DeleteMapping("/user/{userId}/book/{bookId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long userId, @PathVariable Long bookId) {
        wishlistRepository.deleteByUserIdAndBookId(userId, bookId);
        return ResponseEntity.noContent().build();
    }
}