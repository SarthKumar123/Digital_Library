package com.digitallibrary.backend.repository;

import com.digitallibrary.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Optional<User> instead of just "User" -- because a user with
     * this email might not exist. Optional forces whoever calls this
     * method to explicitly handle the "not found" case, instead of
     * accidentally getting a null and crashing with a
     * NullPointerException somewhere unexpected later.
     *
     * We'll use this constantly in login: "does a user with this
     * email already exist?"
     */
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}