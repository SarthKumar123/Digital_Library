import React, { useEffect, useState } from "react";
import { Heart, BookOpen, Trash2, LogIn } from "lucide-react";
import { getWishlist, removeFromWishlist } from "../api";
import "./Wishlist.css";

export default function Wishlist({ loggedIn, onLoginRequired, onSelectBook }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loggedIn) {
      setLoading(false);
      return;
    }
    const userId = localStorage.getItem("userId");
    getWishlist(userId)
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [loggedIn]);

  const handleRemove = async (bookId) => {
    const userId = localStorage.getItem("userId");
    // Update the screen immediately, don't wait for the network --
    // if the request somehow fails, it's a rare edge case and the
    // book will just reappear next time this page loads.
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    try {
      await removeFromWishlist(userId, bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (!loggedIn) {
    return (
      <main className="account-page">
        <div className="account-heading">
          <h1>Wishlist</h1>
          <p>Books you've saved for later.</p>
        </div>
        <div className="account-logged-out">
          <Heart size={32} color="#8FA05C" />
          <h3>You're not logged in</h3>
          <p>Log in to see the books you've saved.</p>
          <button onClick={onLoginRequired}>
            <LogIn size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
            Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <div className="account-heading">
        <h1>My Wishlist</h1>
        <p>Books you've saved to read later. Only you can see this list.</p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#767767", padding: "40px 0" }}>Loading your wishlist…</p>
      ) : books.length === 0 ? (
        <div className="wishlist-empty">
          <Heart size={36} color="#c4c4b0" />
          <h3>Your wishlist is empty</h3>
          <p>Tap the heart icon on any book's page to save it here.</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {books.map((b) => (
            <div key={b.id} className="wishlist-card">
              <div className="wishlist-cover" style={{ background: b.bg }}>
                {b.image ? (
                  <img src={b.image} alt={b.title} />
                ) : (
                  <div className="wishlist-cover-title" style={{ color: b.accent }}>
                    {b.title}
                  </div>
                )}
                <button
                  className="wishlist-remove-btn"
                  onClick={() => handleRemove(b.id)}
                  aria-label="Remove from wishlist"
                  title="Remove from wishlist"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="wishlist-info">
                <div className="wishlist-title">{b.title}</div>
                <div className="wishlist-author">{b.author}</div>
                <button className="wishlist-view-btn" onClick={() => onSelectBook(b)}>
                  <BookOpen size={13} /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
