import React from "react";
import { BookOpen, Phone, Mail, MapPin, Globe, MessageCircle, Camera, Link2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <BookOpen size={20} color="#5B6B2E" />
            <span>Digital Library</span>
          </div>
          <p className="footer-tagline">
            A smart way to manage your library resources and members.
          </p>
          <div className="footer-socials">
            {[Globe, MessageCircle, Camera, Link2].map((Icon, i) => (
              <div key={i} className="footer-social-icon">
                <Icon size={14} color="#3C3C2E" />
              </div>
            ))}
          </div>
        </div>

        <FooterCol title="Quick Links" items={["Home", "Books", "My Books", "Borrow History", "Fines", "Profile"]} />
        <FooterCol title="Support" items={["Help Center", "Terms & Conditions", "Privacy Policy", "FAQs", "Contact Us"]} />

        <div>
          <div className="footer-col-title">Contact Us</div>
          <ContactRow icon={<Phone size={14} />} text="+91 98765 43210" />
          <ContactRow icon={<Mail size={14} />} text="support@digitallibrary.com" />
          <ContactRow icon={<MapPin size={14} />} text="123 Library Street, City, Country" />
        </div>

        <div>
          <div className="footer-col-title">Download Our App</div>
          <div className="app-badge">
            <span className="app-badge-eyebrow">GET IT ON</span>
            <span className="app-badge-name">Google Play</span>
          </div>
          <div className="app-badge">
            <span className="app-badge-eyebrow">Download on the</span>
            <span className="app-badge-name">App Store</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">© 2024 Digital Library. All rights reserved.</div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div className="footer-col-title">{title}</div>
      {items.map((i) => (
        <div key={i} className="footer-col-item">
          {i}
        </div>
      ))}
    </div>
  );
}

function ContactRow({ icon, text }) {
  return (
    <div className="footer-contact-row">
      {icon}
      {text}
    </div>
  );
}
