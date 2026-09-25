import React, { useState, useEffect } from "react";
import { X, Sun, Moon, Bell, Volume2, Layout } from "lucide-react";
import "./SettingsModal.css";

const THEME_KEY = "theme";
const NOTIF_KEY = "settings.notifications";
const SOUND_KEY = "settings.sound";
const COMPACT_KEY = "settings.compact";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

export default function SettingsModal({ onClose }) {
  const [theme, setTheme] = useState(localStorage.getItem(THEME_KEY) || "light");
  const [notifications, setNotifications] = useState(localStorage.getItem(NOTIF_KEY) !== "false");
  const [sound, setSound] = useState(localStorage.getItem(SOUND_KEY) === "true");
  const [compact, setCompact] = useState(localStorage.getItem(COMPACT_KEY) === "true");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(NOTIF_KEY, notifications);
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(SOUND_KEY, sound);
  }, [sound]);

  useEffect(() => {
    localStorage.setItem(COMPACT_KEY, compact);
    document.documentElement.classList.toggle("compact-mode", compact);
  }, [compact]);

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Appearance</div>
          <div className="theme-toggle">
            <button
              className={theme === "light" ? "active" : ""}
              onClick={() => setTheme("light")}
              type="button"
            >
              <Sun size={15} /> Light
            </button>
            <button
              className={theme === "dark" ? "active" : ""}
              onClick={() => setTheme("dark")}
              type="button"
            >
              <Moon size={15} /> Dark
            </button>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Preferences</div>

          <SettingRow
            icon={<Bell size={16} />}
            label="Notifications"
            description="Show the notification badge in the header"
            checked={notifications}
            onChange={setNotifications}
          />
          <SettingRow
            icon={<Volume2 size={16} />}
            label="Sound Effects"
            description="Play a sound when a message arrives"
            checked={sound}
            onChange={setSound}
          />
          <SettingRow
            icon={<Layout size={16} />}
            label="Compact Mode"
            description="Reduce spacing to fit more on screen"
            checked={compact}
            onChange={setCompact}
          />
        </div>

        <p className="settings-note">Preferences are saved on this device.</p>
      </div>
    </div>
  );
}

function SettingRow({ icon, label, description, checked, onChange }) {
  return (
    <div className="setting-row">
      <div className="setting-row-icon">{icon}</div>
      <div className="setting-row-text">
        <div className="setting-row-label">{label}</div>
        <div className="setting-row-desc">{description}</div>
      </div>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="switch-track" />
      </label>
    </div>
  );
}
