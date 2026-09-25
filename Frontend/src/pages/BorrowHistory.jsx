import React, { useEffect, useState } from "react";
import { LogIn, ChevronDown } from "lucide-react";
import { getBorrowHistory } from "../api";
import "./Account.css";

const PAGE_SIZE = 6;


function formatDate(isoDate) {
  if (!isoDate) return "—";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}


function getStatusInfo(record) {
  if (record.status === "RETURNED") {
    return { label: "Returned", className: "returned" };
  }
  const isOverdue = record.dueDate && new Date(record.dueDate) < new Date();
  return isOverdue
    ? { label: "Overdue", className: "overdue" }
    : { label: "Borrowed", className: "borrowed" };
}

export default function BorrowHistory({ loggedIn, onLoginRequired }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    if (!loggedIn) {
      setLoading(false);
      return;
    }
    const userId = localStorage.getItem("userId");
    getBorrowHistory(userId)
      .then((data) => {
        // Sort by id, not borrowedOn -- the backend only stores a
        // LocalDate (no time of day), so two books borrowed on the
        // same calendar day have an IDENTICAL borrowedOn value and
        // can't be reliably ordered by date alone. Since id is
        // always assigned in the exact order rows were inserted,
        // sorting by id descending guarantees the most recently
        // borrowed book is always shown first.
        const sorted = [...data].sort((a, b) => b.id - a.id);
        setRecords(sorted);
        setVisibleCount(PAGE_SIZE);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Couldn't load your borrow history.");
        setLoading(false);
      });
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <main className="account-page">
        <div className="account-heading">
          <h1>Borrow History</h1>
          <p>A record of everything you've borrowed.</p>
        </div>
        <div className="account-logged-out">
          <h3>You're not logged in</h3>
          <p>Log in to view your borrow history.</p>
          <button onClick={onLoginRequired}>
            <LogIn size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
            Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="account-page">
      <div className="account-heading">
        <h1>Borrow History</h1>
        <p>A record of everything you've borrowed.</p>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#767767", padding: "40px 0" }}>Loading your history…</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "#b33f3f", padding: "40px 0" }}>{error}</p>
      ) : records.length === 0 ? (
        <div className="account-logged-out">
          <h3>No borrow history yet</h3>
          <p>Books you borrow will show up here.</p>
        </div>
      ) : (
        <div className="account-table-card">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Borrowed On</th>
                <th>Due Date</th>
                <th>Returned On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.slice(0, visibleCount).map((r) => {
                const status = getStatusInfo(r);
                return (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.book?.title}</div>
                      <div style={{ fontSize: 11.5, color: "#9a9a88" }}>{r.book?.author}</div>
                    </td>
                    <td>{formatDate(r.borrowedOn)}</td>
                    <td>{formatDate(r.dueDate)}</td>
                    <td>{formatDate(r.returnedOn)}</td>
                    <td>
                      <span className={`history-status-pill ${status.className}`}>{status.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {records.length > PAGE_SIZE && (
            <div className="history-pagination">
              {visibleCount < records.length ? (
                <button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                  <ChevronDown size={14} /> Show More ({records.length - visibleCount} more)
                </button>
              ) : (
                <button onClick={() => setVisibleCount(PAGE_SIZE)}>Show Less</button>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
