

package com.digitallibrary.backend.repository;

import com.digitallibrary.backend.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * This is just an INTERFACE -- there's no implementation here, and
 * you'll never write one. This is the part of Spring Data JPA that
 * feels like magic the first time you see it:
 *
 * By extending JpaRepository<Book, Long> (Book = the entity type,
 * Long = the type of its @Id field), you instantly get a full set of
 * working database methods for free:
 *
 *   bookRepository.save(book)        -> INSERT or UPDATE
 *   bookRepository.findById(1L)      -> SELECT * FROM books WHERE id = 1
 *   bookRepository.findAll()         -> SELECT * FROM books
 *   bookRepository.deleteById(1L)    -> DELETE FROM books WHERE id = 1
 *   bookRepository.count()           -> SELECT COUNT(*) FROM books
 *
 * Spring generates a working class implementing this interface at
 * startup, using a dynamic proxy. You never see that generated code,
 * but it's really running underneath.
 *
 * Beyond the free methods, we can define our OWN query methods just
 * by naming them a certain way -- Spring parses the method name and
 * builds the SQL query for us. No SQL written by hand for these:
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // Spring reads "findByCategory" and builds:
    //   SELECT * FROM books WHERE category = ?
    List<Book> findByCategory(String category);

    // "findByAuthor" -> SELECT * FROM books WHERE author = ?
    List<Book> findByAuthor(String author);

    // "ContainingIgnoreCase" -> SELECT * FROM books WHERE LOWER(title) LIKE LOWER('%?%')
    // This is how we'll implement the search bar.
    List<Book> findByTitleContainingIgnoreCase(String keyword);

    // You can combine conditions too:
    // "findByAvailableCopiesGreaterThan" -> WHERE available_copies > ?
    List<Book> findByAvailableCopiesGreaterThan(int copies);
}

