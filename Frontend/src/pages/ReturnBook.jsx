import React, { useState } from "react";
import {
  Home,
  ChevronRight,
  Calendar,
  Info,
  AlertTriangle,
  CreditCard,
  ArrowLeft,
  Lock,
  Wallet,
} from "lucide-react";
import "./ReturnBook.css";
import { returnBook } from "../api";
import MockRazorpayModal from "./MockRazorpayModal";

export default function ReturnBook({
  book,
  onCancel,
  onNavigateHome,
  onReturned,
}) {
  const actualBook = book.book || book;

  const lateDays = 4;
  const fine = lateDays * 10;

  const [showPayment, setShowPayment] = useState(false);

  const handleReturn = async () => {
    try {
      await returnBook(book.id);

      onReturned();
    } catch (error) {
      console.error(error);
      alert("Failed to return book");
    }
  };

  // Payment succeeded in the mock checkout -- now actually complete
  // the return against the real backend.
  const handlePaymentSuccess = () => {
    setShowPayment(false);
    handleReturn();
  };

  return (
    <main className="return-page">
      <div className="detail-breadcrumb">
        <button onClick={onNavigateHome}>
          <Home size={14} /> Home
        </button>

        <ChevronRight size={13} />
        <span>My Books</span>

        <ChevronRight size={13} />
        <span className="current">Return Book</span>
      </div>

      <div className="return-heading">
        <h1>Return Book</h1>
        <p>Please review the details below before returning the book.</p>
      </div>

      <div className="return-card">
        <div className="return-grid">
          <div className="return-cover-col">
            <div
              className="return-cover"
              style={{ background: "#F1EFE4" }}
            >
              <div className="return-cover-title">
                {actualBook.title}
              </div>

              <div className="return-cover-author">
                {actualBook.author}
              </div>
            </div>

            <div className="return-book-name">
              <h3>{actualBook.title}</h3>
              <p>{actualBook.author}</p>

              <span className="return-category-pill">
                {actualBook.category}
              </span>
            </div>
          </div>

          <div className="return-details-col">
            <h4>
              <Calendar size={15} /> Borrow Details
            </h4>

            <ReturnRow
              label="Borrowed On"
              value={book.borrowedOn}
            />

            <ReturnRow
              label="Due Date"
              value={book.dueDate}
            />

            <ReturnRow
              label="Returning On"
              value={new Date().toLocaleDateString()}
            />

            <ReturnRow
              label="Borrow Duration"
              value="14 Days"
            />
          </div>

          <div className="return-summary-col">
            <h4>
              <Info size={15} /> Return Summary
            </h4>

            <ReturnRow
              label="Late Days"
              value={`${lateDays} Days`}
              valueClass="danger"
            />

            <ReturnRow
              label="Fine"
              value={`₹${fine}`}
              valueClass="danger"
            />

            <div className="return-divider" />

            <div className="return-total">
              <span>Total Fine</span>
              <strong>₹{fine}</strong>
            </div>
          </div>
        </div>

        <div className="fine-banner">
          <div className="fine-banner-icon">
            <AlertTriangle
              size={18}
              color="#C1512D"
            />
          </div>

          <div className="fine-banner-text">
            <h5>Fine Applicable</h5>

            <p>
              You are returning this book after the due
              date. Please pay the fine to complete the
              return.
            </p>
          </div>

          <Wallet
            size={38}
            color="#5B6B2E"
            style={{ opacity: 0.3 }}
          />
        </div>

        <div className="return-actions">
          <button
            className="pay-return-btn"
            onClick={() => setShowPayment(true)}
          >
            <CreditCard size={16} />
            Pay ₹{fine} & Return
          </button>

          <button
            className="cancel-return-btn"
            onClick={onCancel}
          >
            <ArrowLeft size={16} />
            Cancel Return
          </button>
        </div>

        <p className="secure-note">
          <Lock size={12} />
          Your payment is secure and encrypted.
        </p>
      </div>

      {showPayment && (
        <MockRazorpayModal
          amount={fine}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </main>
  );
}

function ReturnRow({ label, value, valueClass }) {
  return (
    <div className="return-row">
      <span>{label}</span>

      <span className={valueClass}>
        {value}
      </span>
    </div>
  );
}