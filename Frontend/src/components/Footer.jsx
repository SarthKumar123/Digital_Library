import React from "react";
import { BookOpen, Phone, Mail, MapPin } from "lucide-react";

const QUICK_LINKS = ["Home", "Books", "My Books"];

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <BookOpen size={22} color="#5B6B2E" />
            <span>Digital Library</span>
          </div>
          <p className="footer-tagline">
            A smart way to manage your library resources and members. Borrow, track, and
            discover your next great read.
          </p>
        </div>

        <div>
          <div className="footer-col-title">Quick Links</div>
          <div className="footer-links-row">
            {QUICK_LINKS.map((link) => (
              <button key={link} className="footer-link" onClick={() => onNavigate(link)}>
                {link}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="footer-col-title">Contact Us</div>
          <ContactRow icon={<Phone size={14} />} text="+91 98765 43210" />
          <ContactRow icon={<Mail size={14} />} text="support@digitallibrary.com" />
          <ContactRow icon={<MapPin size={14} />} text="123 Library Street, City, Country" />
        </div>
      </div>

      <div className="footer-bottom">© 2024 Digital Library. All rights reserved.</div>
    </footer>
  );
}

function ContactRow({ icon, text }) {
  return (
    <div className="footer-contact-row">
      <span className="footer-contact-icon">{icon}</span>
      {text}
    </div>
  );
}
