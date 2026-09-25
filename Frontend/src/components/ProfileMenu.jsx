import React, { useState, useRef, useEffect } from "react";
import { User, ChevronDown, Settings, LogOut } from "lucide-react";
import SettingsModal from "./SettingsModal";

export default function ProfileMenu({ name, onLogout, onGoToProfile }) {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="profile-menu" ref={ref}>
      <button className="profile-trigger" onClick={() => setOpen((o) => !o)}>
        <div className="profile-avatar">
          <User size={17} />
        </div>
        <span className="profile-name">{name}</span>
        <ChevronDown size={15} color="#767767" />
      </button>

      {open && (
        <div className="profile-dropdown">
          <MenuItem
            icon={<User size={15} />}
            label="My Profile"
            onClick={() => {
              setOpen(false);
              onGoToProfile();
            }}
          />
          <MenuItem
            icon={<Settings size={15} />}
            label="Settings"
            onClick={() => {
              setOpen(false);
              setShowSettings(true);
            }}
          />
          <div className="profile-divider" />
          <MenuItem icon={<LogOut size={15} />} label="Log Out" onClick={onLogout} danger />
        </div>
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

function MenuItem({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`profile-menu-item${danger ? " danger" : ""}`}
    >
      {icon}
      {label}
    </button>
  );
}
