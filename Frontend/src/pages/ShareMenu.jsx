import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Camera, Link2, Check, Share2 } from "lucide-react";
import "./ShareMenu.css";


/**

 */
export default function ShareMenu({ title, url }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const shareText = `Check out "${title}" on Digital Library`;
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, text: shareText, url });
      setOpen(false);
    } catch (err) {
      // User cancelled the share sheet -- not an error, just close quietly.
    }
  };

  const handleWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const handleInstagram = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      // Clipboard permission denied -- Instagram tab still opens either way.
    }
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="share-menu" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} type="button">
        <Share2 size={15} /> Share
      </button>

      {open && (
        <div className="share-dropdown">
          <div className="share-dropdown-title">Share this book</div>

          {canNativeShare && (
            <button className="share-option" onClick={handleNativeShare}>
              <Share2 size={16} color="#3C3C2E" />
              Share via…
            </button>
          )}

          <button className="share-option" onClick={handleWhatsApp}>
            <MessageCircle size={16} color="#25D366" />
            WhatsApp
          </button>

          <button className="share-option" onClick={handleInstagram}>
            <Camera size={16} color="#C1387D" />
            Instagram
            <span className="share-option-note">copies link</span>
          </button>

          <button className="share-option" onClick={handleCopy}>
            {copied ? <Check size={16} color="#5B6B2E" /> : <Link2 size={16} color="#3C3C2E" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>

          <div className="share-dropdown-hint">
            Instagram doesn't support pre-filled links from other sites — we copy the link so you can paste it into a DM, Story, or your bio.
          </div>
        </div>
      )}
    </div>
  );
}
