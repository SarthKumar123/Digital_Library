import React, { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { getMyBooks } from "../api";
import "./Account.css";

export default function MyBooks({
  loggedIn,
  onLoginRequired,
  onReturn
}) {

  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!loggedIn) return;

    const userId = localStorage.getItem("userId");

    console.log("CURRENT USER ID =", userId);

    getMyBooks(userId)
      .then((data) => {
        console.log("BOOKS FOR USER =", data);
        setBooks(data);
      })
      .catch(console.error);

  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <main className="account-page">
        <h2>My Books</h2>
        <p>Books you currently have borrowed.</p>

        <button onClick={onLoginRequired}>
          <LogIn size={14} />
          Login
        </button>
      </main>
    );
  }

  return (
    <main className="account-page">

      <h2>My Books</h2>

      <div className="my-books-grid">

        {books.length === 0 ? (
          <p>No borrowed books found.</p>
        ) : (
          books.map((record) => (
            <div key={record.id} className="my-book-card">

              <div className="my-book-info">

                <h4>{record.book.title}</h4>

                <p>{record.book.author}</p>

                <div className="my-book-due">
                  Due: <strong>{record.dueDate}</strong>
                </div>

                <button
                  className="my-book-return-btn"
                  onClick={() => onReturn(record)}
                >
                  Return Book
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </main>
  );
}