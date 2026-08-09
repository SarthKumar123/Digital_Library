import React from "react";
import { LogIn } from "lucide-react";
import "./Account.css";

const HISTORY = [
  { book: "Atomic Habits", author: "James Clear", borrowed: "20 Jul 2024", returned: "02 Aug 2024", status: "Returned" },
  { book: "Deep Work", author: "Cal Newport", borrowed: "01 Jun 2024", returned: "14 Jun 2024", status: "Returned" },
  { book: "The Alchemist", author: "Paulo Coelho", borrowed: "10 May 2024", returned: "—", status: "Ongoing" },
  { book: "Think and Grow Rich", author: "Napoleon Hill", borrowed: "17 Apr 2024", returned: "05 May 2024", status: "Returned Late" },
];

export default function BorrowHistory({ loggedIn, onLoginRequired }) {
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

      <div className="account-table-card">
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Borrowed On</th>
              <th>Returned On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((h) => (
              <tr key={h.book}>
                <td>
                  <div style={{ fontWeight: 600 }}>{h.book}</div>
                  <div style={{ fontSize: 11.5, color: "#9a9a88" }}>{h.author}</div>
                </td>
                <td>{h.borrowed}</td>
                <td>{h.returned}</td>
                <td>{h.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
