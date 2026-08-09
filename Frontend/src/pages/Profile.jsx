import React, { useState, useEffect } from "react";
import { User, LogIn } from "lucide-react";
import { getUser, updateUser } from "../api";
import "./Account.css";

export default function Profile({
  loggedIn,
  userName,
  onLoginRequired,
}) {
  const [name, setName] = useState(userName || "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) return;

        const user = await getUser(userId);

        setName(user.name || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setAddress(user.address || "");
      } catch (err) {
        console.error(err);
      }
    };

    if (loggedIn) {
      loadProfile();
    }
  }, [loggedIn]);

  const saveProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");

      await updateUser(userId, {
        name,
        phone,
        address,
      });

      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to update profile");
      console.error(err);
    }
  };

  if (!loggedIn) {
    return (
      <main className="account-page">
        <div className="account-heading">
          <h1>Profile</h1>
          <p>Manage your account details.</p>
        </div>

        <div className="account-logged-out">
          <User size={32} color="#8FA05C" />
          <h3>You're not logged in</h3>
          <p>Log in to view and edit your profile.</p>

          <button onClick={onLoginRequired}>
            <LogIn
              size={14}
              style={{
                marginRight: 6,
                verticalAlign: "-2px",
              }}
            />
            Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="account-page">
      <div className="account-heading">
        <h1>Profile</h1>
        <p>Manage your account details and preferences.</p>
      </div>

      <div className="profile-card">
        <div className="profile-card-avatar">
          {name ? name.charAt(0).toUpperCase() : "U"}
        </div>

        <div>
          <div className="profile-card-name">{name}</div>
          <div className="profile-card-email">{email}</div>
          <span className="profile-card-badge">
            Active Member
          </span>
        </div>
      </div>

      <div className="profile-fields">
        <div className="profile-field">
          <label>Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="profile-field">
          <label>Email</label>
          <input value={email} disabled />
        </div>

        <div className="profile-field">
          <label>Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div className="profile-field">
          <label>Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
          />
        </div>

        <button
          className="save-btn"
          onClick={saveProfile}
        >
          Save Changes
        </button>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <div className="profile-stat-value">3</div>
          <div className="profile-stat-label">
            Books Currently Borrowed
          </div>
        </div>

        <div className="profile-stat">
          <div className="profile-stat-value">18</div>
          <div className="profile-stat-label">
            Total Books Read
          </div>
        </div>

        <div className="profile-stat">
          <div className="profile-stat-value">₹40</div>
          <div className="profile-stat-label">
            Outstanding Fines
          </div>
        </div>
      </div>
    </main>
  );
}