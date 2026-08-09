import React, { useState } from "react";
import { X, Smartphone, CreditCard, Building2, Wallet, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import "./MockRazorpayModal.css";

const METHODS = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "netbanking", label: "Netbanking", icon: Building2 },
  { id: "wallet", label: "Wallet", icon: Wallet },
];

/**
 * A purely visual stand-in for the Razorpay checkout widget --
 * no network calls, no real payment gateway involved. It exists so
 * the app demonstrates a realistic "pay a fine" flow for a class
 * project without needing real payment gateway credentials/keys.
 *
 * Flow: pick a method -> fill dummy fields -> click Pay -> a couple
 * seconds of a fake "processing" spinner -> success checkmark ->
 * calls onSuccess(), which the parent uses to actually complete the
 * book return in the real backend.
 */
export default function MockRazorpayModal({ amount, merchantName = "Digital Library", onClose, onSuccess }) {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [bank, setBank] = useState("");
  const [status, setStatus] = useState("form"); // "form" | "processing" | "success"

  const handlePay = (e) => {
    e.preventDefault();
    setStatus("processing");
    // Simulate network/gateway delay
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        onSuccess();
      }, 900);
    }, 1600);
  };

  return (
    <div className="rzp-overlay" onClick={status === "form" ? onClose : undefined}>
      <div className="rzp-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="rzp-header">
          <div className="rzp-merchant">
            <div className="rzp-merchant-logo">DL</div>
            <div>
              <div className="rzp-merchant-name">{merchantName}</div>
              <div className="rzp-amount">₹{amount}.00</div>
            </div>
          </div>
          {status === "form" && (
            <button className="rzp-close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="rzp-test-badge">TEST MODE — no real payment will be made</div>

        {status === "processing" && (
          <div className="rzp-status-view">
            <Loader2 size={36} className="rzp-spin" color="#3395FF" />
            <p>Processing your payment…</p>
            <span>Do not close or refresh this window</span>
          </div>
        )}

        {status === "success" && (
          <div className="rzp-status-view">
            <CheckCircle2 size={40} color="#0EA871" />
            <p>Payment Successful</p>
            <span>Redirecting…</span>
          </div>
        )}

        {status === "form" && (
          <>
            {/* Method tabs */}
            <div className="rzp-methods">
              {METHODS.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    className={`rzp-method-tab${method === m.id ? " active" : ""}`}
                    onClick={() => setMethod(m.id)}
                    type="button"
                  >
                    <Icon size={16} />
                    {m.label}
                  </button>
                );
              })}
            </div>

            <form className="rzp-form" onSubmit={handlePay}>
              {method === "upi" && (
                <label className="rzp-field">
                  UPI ID
                  <input
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </label>
              )}

              {method === "card" && (
                <>
                  <label className="rzp-field">
                    Card Number
                    <input
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                      required
                    />
                  </label>
                  <div className="rzp-field-row">
                    <label className="rzp-field">
                      Expiry
                      <input
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        maxLength={5}
                        required
                      />
                    </label>
                    <label className="rzp-field">
                      CVV
                      <input
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={3}
                        type="password"
                        required
                      />
                    </label>
                  </div>
                </>
              )}

              {method === "netbanking" && (
                <label className="rzp-field">
                  Select Bank
                  <select value={bank} onChange={(e) => setBank(e.target.value)} required>
                    <option value="">Choose your bank</option>
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Punjab National Bank</option>
                  </select>
                </label>
              )}

              {method === "wallet" && (
                <div className="rzp-wallet-note">
                  Select a wallet provider to continue (demo only — no real wallet is charged).
                </div>
              )}

              <button type="submit" className="rzp-pay-btn">
                Pay ₹{amount}
              </button>
            </form>

            <div className="rzp-footer">
              <ShieldCheck size={13} />
              Simulated checkout for demo purposes — powered by nothing real
            </div>
          </>
        )}
      </div>
    </div>
  );
}
