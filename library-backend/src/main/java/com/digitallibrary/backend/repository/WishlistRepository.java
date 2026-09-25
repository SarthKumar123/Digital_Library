package com.digitallibrary.backend.repository;

import com.digitallibrary.backend.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {

    // Powers the Wishlist page: every book THIS user has saved.
    List<WishlistItem> findByUserId(Long userId);

    // Used to check "is this book already wishlisted?" when the
    // Book Detail page loads, so the heart icon starts filled in
    // correctly instead of always starting empty.
    Optional<WishlistItem> findByUserIdAndBookId(Long userId, Long bookId);

    boolean existsByUserIdAndBookId(Long userId, Long bookId);

    @Modifying
    @Query("DELETE FROM WishlistItem w WHERE w.user.id = :userId AND w.book.id = :bookId")
    void deleteByUserIdAndBookId(Long userId, Long bookId);
}