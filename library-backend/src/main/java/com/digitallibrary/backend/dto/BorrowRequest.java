package com.digitallibrary.backend.dto;

public class BorrowRequest {

    private Long userId;
    private Long bookId;

    public BorrowRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }
}