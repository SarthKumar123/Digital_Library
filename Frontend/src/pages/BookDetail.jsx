import React, { useState, useEffect } from "react";
import {
  Heart,
  Star,
  User,
  Tag,
  Building2,
  Globe2,
  FileText,
  Hash,
  CheckCircle2,
  BookOpen,
  RotateCcw,
  Home,
  ChevronRight
} from "lucide-react";

import "./BookDetail.css";
import { borrowBook, checkWishlisted, addToWishlist, removeFromWishlist } from "../api";
import ShareMenu from "./ShareMenu";

export default function BookDetail({
  book,
  loggedIn,
  onNavigateBooks,
  onNavigateHome,
  onGoToReturn,
  onLoginRequired
}) {
  const [borrowed, setBorrowed] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);

  const stars = Math.round(book.rating || 0);

 
  useEffect(() => {
    if (!loggedIn) {
      setWishlisted(false);
      return;
    }
    const userId = localStorage.getItem("userId");
    checkWishlisted(userId, book.id).then(setWishlisted);
  }, [loggedIn, book.id]);

  const handleToggleWishlist = async () => {
    if (!loggedIn) {
      onLoginRequired();
      return;
    }
    const userId = localStorage.getItem("userId");
    setWishlistBusy(true);
    try {
      if (wishlisted) {
        await removeFromWishlist(userId, book.id);
        setWishlisted(false);
      } else {
        await addToWishlist(userId, book.id);
        setWishlisted(true);
      }
    } catch (error) {
      console.error("WISHLIST ERROR:", error);
    } finally {
      setWishlistBusy(false);
    }
  };

  const handleBorrow = async () => {

  const userId = localStorage.getItem("userId");

  console.log("USER ID FROM STORAGE =", userId);
  console.log("BOOK ID =", book.id);

  if (!loggedIn) {
    onLoginRequired();
    return;
  }

  try {

    const record = await borrowBook(
      Number(userId),
      book.id
    );

    console.log("BORROW RESPONSE =", record);

    alert("Book borrowed successfully");
    setBorrowed(true);

  } catch (error) {
    console.error("BORROW ERROR:", error);

    if (error.response) {
      alert(error.response.data);
    } else {
      alert(error.message);
    }
  }
};

  // A shareable link that actually opens straight to THIS book --
  // DigitalLibrary.jsx watches for ?book=<id> in the URL on load and
  // jumps straight to this page once the books list has loaded.
  const shareUrl = `${window.location.origin}${window.location.pathname}?book=${book.id}`;

  return (
    <main className="detail-page">

      <div className="detail-breadcrumb">
        <button onClick={onNavigateHome}>
          <Home size={14} />
          Home
        </button>

        <ChevronRight size={13} />

        <button onClick={onNavigateBooks}>
          Books
        </button>

        <ChevronRight size={13} />

        <span className="current">{book.title}</span>
      </div>

      <div className="detail-layout">

        {/* LEFT */}
        <div className="detail-cover-card">
          <img
            src={book.image}
            alt={book.title}
            className="detail-book-image"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400";
            }}
          />

          {!loggedIn && (
            <div className="detail-meta-list">
              <MetaRow icon={<User size={14} />} label="Author" value={book.author} />
              <MetaRow icon={<Building2 size={14} />} label="Publisher" value={book.publisher} />
              <MetaRow icon={<Tag size={14} />} label="Category" value={book.category} />
              <MetaRow icon={<Globe2 size={14} />} label="Language" value={book.language} />
              <MetaRow icon={<FileText size={14} />} label="Pages" value={book.pages} />
              <MetaRow icon={<Hash size={14} />} label="ISBN" value={book.isbn} />
            </div>
          )}
        </div>

        {/* CENTER */}
        <div className="detail-main">

          <div className="detail-main-top">
            <div>
              <h1>{book.title}</h1>

              <p className="detail-tagline">
                {book.tagline}
              </p>

              <div className="detail-author-row">
                <User size={14} />
                {book.author}
              </div>
            </div>

            <div className="detail-actions">
              <button onClick={handleToggleWishlist} disabled={wishlistBusy} type="button">
                <Heart
                  size={15}
                  fill={wishlisted ? "#B33F3F" : "none"}
                  color={wishlisted ? "#B33F3F" : "#3C3C2E"}
                />
                {wishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>

              <ShareMenu title={book.title} url={shareUrl} />
            </div>
          </div>

          <div className="detail-rating-row">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i <= stars ? "#E3B23C" : "none"}
                  color="#E3B23C"
                />
              ))}
            </div>

            <span>
              {book.rating || 4.5} (
              {book.ratingCount || 100}
              ratings)
            </span>
          </div>

          <div className="detail-status-row">
            <span className="status-pill">
              {book.status}
            </span>

            <span className="copies-text">
              {book.copies} copies available
            </span>
          </div>

          <div className="detail-divider" />

          {loggedIn && (
            <div className="detail-meta-row">
              <MetaRow icon={<Tag size={14} />} label="Category" value={book.category} />
              <MetaRow icon={<Building2 size={14} />} label="Publisher" value={book.publisher} />
              <MetaRow icon={<Globe2 size={14} />} label="Language" value={book.language} />
              <MetaRow icon={<FileText size={14} />} label="Pages" value={book.pages} />
              <MetaRow icon={<Hash size={14} />} label="ISBN" value={book.isbn} />
            </div>
          )}

          <h3>About the Book</h3>

          <p className="detail-description">
            {book.description}
          </p>

          <div className="detail-quickfacts">
            <QuickFact label="Borrow Duration" value="14 Days" />
            <QuickFact label="Late Fine" value="₹10 / Day" />
            <QuickFact label="Available Copies" value={book.copies} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="detail-side">

          {borrowed ? (
            <div className="side-card confirmed">

              <div className="confirm-check">
                <CheckCircle2 size={30} color="#fff" />
              </div>

              <h4>You have borrowed this book!</h4>

              <p>
                Enjoy reading and keep learning.
              </p>

              <button className="side-btn primary">
                <BookOpen size={15} />
                Read Book
              </button>

              <button
                className="side-btn outline"
                onClick={() => {
                  const record = JSON.parse(
                    localStorage.getItem("currentBorrowRecord")
                  );

                  onGoToReturn(record);
                }}
              >
                <RotateCcw size={15} />
                Return Book
              </button>

            </div>
          ) : (
            <div className="side-card">

              <h4 className="side-title">
                <BookOpen size={15} />
                Borrow Information
              </h4>

              <div className="side-meta">
                <SideRow label="Borrow Duration" value="14 Days" />
                <SideRow label="Late Fine" value="₹10 / Day" />
                <SideRow label="Available Copies" value={book.copies} />
              </div>

              <button
                className="side-btn primary"
                onClick={handleBorrow}
              >
                <BookOpen size={15} />
                Borrow Book
              </button>

              {!loggedIn && (
                <p className="login-hint">
                  Login to borrow this book
                </p>
              )}

            </div>
          )}

        </div>

      </div>
    </main>
  );
}

function MetaRow({ icon, label, value }) {
  return (
    <div className="meta-row">
      <span>
        {icon} {label}
      </span>
      <strong>{value}</strong>
    </div>
  );
}

function QuickFact({ label, value }) {
  return (
    <div className="quick-fact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SideRow({ label, value }) {
  return (
    <div className="side-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
