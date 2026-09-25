import React, { useState, useEffect } from "react";

import {
  Search,
  RotateCcw,
  Grid,
  List,
  ArrowLeft,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { CATEGORIES, AUTHORS } from "../data";
import "./Books.css";

const SORT_OPTIONS = ["Newest First", "Oldest First", "Title A-Z", "Title Z-A"];
const AVAILABILITY_OPTIONS = ["Availability", "Available", "Borrowed"];

export default function Books({ books, loading, onSelectBook, initialSearch = "" }) {
  const [query, setQuery] = useState(initialSearch);

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [author, setAuthor] = useState(AUTHORS[0]);
  const [availability, setAvailability] = useState(AVAILABILITY_OPTIONS[0]);
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);

  const resetFilters = () => {
    setQuery("");
    setCategory(CATEGORIES[0]);
    setAuthor(AUTHORS[0]);
    setAvailability(AVAILABILITY_OPTIONS[0]);
    setSort(SORT_OPTIONS[0]);
  };

  const filtered = (books || []).filter((b) => {
    const matchesQuery =
      !query ||
      b.title?.toLowerCase().includes(query.toLowerCase()) ||
      b.author?.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      category === CATEGORIES[0] || b.category === category;

    const matchesAuthor =
      author === AUTHORS[0] || b.author === author;

    return matchesQuery && matchesCategory && matchesAuthor;
  });

  return (
    <main className="books-page">
      <div className="books-page-heading">
        <h1>All Books</h1>
        <p>Explore our collection of books across various categories.</p>
      </div>

      <div className="books-filters">
        <div className="filter-search">
          <Search size={16} color="#9A9A88" />
          <input
            placeholder="Search books by title, author or ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select value={author} onChange={(e) => setAuthor(e.target.value)}>
          {AUTHORS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          {AVAILABILITY_OPTIONS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>

        <div className="filter-sort">
          <span>Sort By</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <button className="reset-btn" onClick={resetFilters}>
          <RotateCcw size={14} />
          Reset Filters
        </button>
      </div>

      <div className="books-result-bar">
        <span>
          Showing 1 – {filtered.length} of {filtered.length} books
        </span>

        <div className="view-toggle">
          <button
            className={view === "grid" ? "active" : ""}
            onClick={() => setView("grid")}
          >
            <Grid size={16} />
          </button>

          <button
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <p
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "#767767",
          }}
        >
          Loading books...
        </p>
      ) : (
        <div className={view === "grid" ? "books-grid" : "books-list"}>
          {filtered.map((b) => (
            <div key={b.id ?? b.title} className="book-card">
              <div className="book-cover">
                <img
                  src={
                    b.image ||
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"
                  }
                  alt={b.title}
                  className="book-image"
                />
              </div>

              <div className="book-info">
                <div className="book-title">{b.title}</div>
                <div className="book-author">{b.author}</div>
                <div className="book-category">{b.category}</div>

                <span className="book-status-pill">
                  {b.status || "Available"}
                </span>

                <button
                  className="view-details-btn"
                  onClick={() => onSelectBook(b)}
                >
                  <Calendar size={14} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          <ArrowLeft size={16} />
        </button>

        {[1, 2, 3].map((n) => (
          <button
            key={n}
            className={page === n ? "active" : ""}
            onClick={() => setPage(n)}
          >
            {n}
          </button>
        ))}

        <span className="pagination-dots">...</span>

        <button
          className={page === 13 ? "active" : ""}
          onClick={() => setPage(13)}
        >
          13
        </button>

        <button
          onClick={() => setPage((p) => Math.min(13, p + 1))}
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </main>
  );
}