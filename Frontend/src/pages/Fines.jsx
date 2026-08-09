import React, { useState } from "react";
import { LogIn } from "lucide-react";
import "./Account.css";

const FINES = [
  { book: "Atomic Habits", amount: 40, status: "Unpaid" },
  { book: "Think and Grow Rich", amount: 60, status: "Paid" },
];

export default function Fines({ loggedIn, onLoginRequired }) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = () => {
    alert("Redirecting to Razorpay...");
    setTimeout(() => {
      setPaymentSuccess(true);
    }, 1000);
  };

  if (!loggedIn) {
    return (
      <main className="account-page">
        <div className="account-heading">
          <h1>Fines</h1>
          <p>Any late fees on your account.</p>
        </div>

        <div className="account-logged-out">
          <h3>You're not logged in</h3>
          <p>Log in to view your fines.</p>

          <button onClick={onLoginRequired}>
            <LogIn size={14} style={{ marginRight: 6, verticalAlign: "-2px" }} />
            Login
          </button>
        </div>
      </main>
    );
  }

  if (paymentSuccess) {
    return (
      <main className="account-page">
        <div className="account-heading">
          <h1>Payment Successful</h1>
          <p>Your fine has been paid successfully.</p>
        </div>

        <div className="account-logged-out">
          <h2 style={{ color: "#5B6B2E" }}>
            ₹40 Payment Successful
          </h2>

          <p>Payment ID: RZP123456789</p>
          <p>Status: SUCCESS</p>

          <button onClick={() => setPaymentSuccess(false)}>
            Back to Fines
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="account-page">
      <div className="account-heading">
        <h1>Fines</h1>
        <p>Any late fees on your account.</p>
      </div>

      <div className="account-table-card">
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {FINES.map((f) => (
              <tr key={f.book}>
                <td>{f.book}</td>
                <td>₹{f.amount}</td>
                <td>{f.status}</td>

                <td>
                  {f.status === "Unpaid" ? (
                    <button
                      onClick={handlePayment}
                      style={{
                        background: "#5B6B2E",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 14px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Pay via Razorpay
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}