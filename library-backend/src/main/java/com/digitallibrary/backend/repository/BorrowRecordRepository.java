package com.digitallibrary.backend.repository;

import com.digitallibrary.backend.entity.BorrowRecord;


import com.digitallibrary.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    // "findByUser" -> WHERE user_id = ? (Spring understands the Java
    // relationship and translates it to the right foreign-key column)
    List<BorrowRecord> findByUser(User user);

    // Reaches THROUGH the relationship: filters on a field of the
    // related User entity, not a column on borrow_records itself.
    List<BorrowRecord> findByUserId(Long userId);

    List<BorrowRecord> findByStatus(String status);
    
    List<BorrowRecord> findByUserIdAndStatus(Long userId, String status);

	@Transactional
	@Modifying
	void deleteByUserId(Long userId);
    
    
    
    
}