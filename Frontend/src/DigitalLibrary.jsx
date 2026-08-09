import React, { useState, useEffect } from "react";
import { Search, Bell, ArrowRight, BookOpen } from "lucide-react";
import "./DigitalLibrary.css";
import { NAV_LINKS } from "./data";
import { fetchBooks } from "./api";
import logoIcon from "./assets/logo-icon.png";
import LoginModal from "./components/LoginModal";
import ProfileMenu from "./components/ProfileMenu";
import Footer from "./components/Footer";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import ReturnBook from "./pages/ReturnBook";
import Profile from "./pages/Profile";
import MyBooks from "./pages/MyBooks";
import BorrowHistory from "./pages/BorrowHistory";
import Fines from "./pages/Fines";
import ChatBot from "./components/ChatBot";

export default function DigitalLibrary({ onOpenAdmin }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Rahul Sharma");
  const [showLogin, setShowLogin] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const [activeDot, setActiveDot] = useState(0);
  const [route, setRoute] = useState("home");
  const [selectedBook, setSelectedBook] = useState(null);

  // Real book data from the backend, plus loading/error state so the
  // UI can show something sensible while the fetch is in flight or
  // if the backend isn't reachable.
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [booksError, setBooksError] = useState("");

  /**
   * useEffect with an empty dependency array ([]) means "run this
   * once, right after the component first renders" -- exactly like
   * componentDidMount in older React class components. This is the
   * standard place to kick off a data fetch when a page loads.
   */
  useEffect(() => {
    fetchBooks()
      .then((data) => {
        setBooks(data);
        setBooksLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setBooksError("Couldn't load books. Is the backend running on port 8080?");
        setBooksLoading(false);
      });
  }, []);

  /**
   * After a Google login, the backend does a full browser redirect
   * back to us with the user's info in the URL's query string (e.g.
   * ?oauthUserId=1&oauthName=Rahul%20Sharma&...). Since that's a
   * fresh page load, none of our React state survives it -- so on
   * every app load, we check: "did we just arrive here FROM a Google
   * redirect?" If so, use those params to log the user in, then
   * clean the URL so it doesn't linger in the address bar or get
   * reused if the page is refreshed.
   */
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  const oauthUserId = params.get("oauthUserId");
  const oauthName = params.get("oauthName");

  if (oauthUserId) {
    console.log("GOOGLE USER ID =", oauthUserId);

    localStorage.setItem("userId", oauthUserId);

    setUserName(oauthName);
    setLoggedIn(true);
    setShowLogin(false);

    console.log(
      "SAVED USER ID =",
      localStorage.getItem("userId")
    );

    window.history.replaceState(
      {},
      "",
      window.location.pathname
    );
  }
}, []);

  const goHome = () => {
    setActiveNav("Home");
    setRoute("home");
  };

  const goBooks = () => {
    setActiveNav("Books");
    setRoute("books");
  };

  const goDetail = (book) => {
    setSelectedBook(book);
    setRoute("bookDetail");
  };

  const goReturn = (bookData) => {
  setSelectedBook(bookData);
  setRoute("returnBook");
  };

  const handleNavClick = (link) => {
    setActiveNav(link);
    const map = {
      Home: "home",
      Books: "books",
      "My Books": "myBooks",
      "Borrow History": "borrowHistory",
      Fines: "fines",
      Profile: "profile",
    };
    setRoute(map[link] || "home");
  };
  console.log("FIRST BOOK", books[0]);
  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <button className="brand" onClick={goHome}>
          <img src={logoIcon} alt="Digital Library logo" className="brand-icon" />
          <span className="brand-text">
            Digital <span className="brand-accent">Library</span>
          </span>
        </button>

        <nav className="nav">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => handleNavClick(link)}
              className={`nav-link${activeNav === link ? " active" : ""}`}
            >
              {link}
            </button>
          ))}
        </nav>

        {/* Right side: login tab lives here */}
        <div className="header-right">
          <div className="bell-wrap">
            <Bell size={20} color="#3C3C2E" />
            <span className="bell-badge">2</span>
          </div>

         {loggedIn ? (
            <ProfileMenu
              name={userName}
              onLogout={() => {
                localStorage.removeItem("userId");
                setLoggedIn(false);
              }}
            />
          ) : (
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Login
            </button>
          )}
        </div>
      </header>

      {showLogin && (
  <LoginModal
    onLogin={(user) => {

      if (user.role === "ADMIN") {
        onOpenAdmin();
        return;
      }

      console.log("LOGIN USER =", user);
      console.log("USER ID =", user.id);

      setUserName(user.name);
      localStorage.setItem("userId", user.id);

      setLoggedIn(true);
      setShowLogin(false);
    }}
  />
)}

      {booksError && route !== "home" && (
        <div className="api-error-banner">{booksError}</div>
      )}

      {/* Page content switches based on route */}
      {route === "books" && (
        <Books books={books} loading={booksLoading} onSelectBook={goDetail} />
      )}

      {route === "bookDetail" && selectedBook && (
        <BookDetail
          book={selectedBook}
          loggedIn={loggedIn}
          onNavigateHome={goHome}
          onNavigateBooks={goBooks}
          onGoToReturn={(book) => {
            console.log("BOOK SENT TO RETURN PAGE:", book);

            setSelectedBook(book);
            setRoute("returnBook");
          }}
          onLoginRequired={() => setShowLogin(true)}
        />
      )}

      {route === "returnBook" && selectedBook && (
        <ReturnBook
          book={selectedBook}
          onCancel={() => setRoute("bookDetail")}
          onNavigateHome={goHome}
          onReturned={goHome}
        />
      )}

      {route === "profile" && (
        <Profile loggedIn={loggedIn} userName={userName} onLoginRequired={() => setShowLogin(true)} />
      )}

      {route === "myBooks" && (
        <MyBooks
          loggedIn={loggedIn}
          onLoginRequired={() => setShowLogin(true)}
          onReturn={(record) => {
          setSelectedBook(record);
          setRoute("returnBook");
        }}
        />
      )}

      {route === "borrowHistory" && (
        <BorrowHistory loggedIn={loggedIn} onLoginRequired={() => setShowLogin(true)} />
      )}

      {route === "fines" && <Fines loggedIn={loggedIn} onLoginRequired={() => setShowLogin(true)} />}

      {route === "home" && (
        <>
          {/* Hero */}
          <section className="hero-section">
            <div className="hero">
              <div className="hero-copy">
                <h1 className="hero-title">
                  Read More,
                  <br />
                  Learn More
                </h1>
                <p className="hero-desc">
                  Explore thousands of books across various categories. Borrow, read and
                  enhance your knowledge.
                </p>
                <button className="hero-cta" onClick={goBooks}>
                  Explore Books <ArrowRight size={16} />
                </button>
              </div>
              <div className="hero-emoji">📚</div>
              <div className="hero-dots">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    onClick={() => setActiveDot(i)}
                    className={`hero-dot${activeDot === i ? " active" : ""}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Search */}
          <section className="search-section">
            <div className="search-bar">
              <div className="search-input-wrap">
                <Search size={18} color="#9A9A88" />
                <input placeholder="Search books by title, author, category or ISBN..." />
              </div>
              <button className="search-btn">
                <Search size={16} /> Search
              </button>
            </div>
          </section>

          {/* Featured Books */}
          <section className="books-section">
            <div className="books-header">
              <h2>Featured Books</h2>
              <a
                href="#"
                className="view-all"
                onClick={(e) => {
                  e.preventDefault();
                  goBooks();
                }}
              >
                View All <ArrowRight size={14} />
              </a>
            </div>

            {booksError && <div className="api-error-banner">{booksError}</div>}

            {booksLoading ? (
              <p style={{ textAlign: "center", color: "#767767", padding: "30px 0" }}>
                Loading books…
              </p>
            ) : (
             <div className="books-grid">
  {books.slice(0, 6).map((b) => (
    <div key={b.id ?? b.title} className="book-card">

                  <div className="book-cover">
                    <img
                      src={b.image}
                      alt={b.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "12px 12px 0 0"
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/250x350?text=No+Cover";
                      }}
                    />
                  </div>

                  <div className="book-info">
                    <div className="book-title">{b.title}</div>
                    <div className="book-author">{b.author}</div>

                    <div className="book-footer">
                      <span className="book-status">
                        {b.status}
                      </span>

                      <button
                        className="book-icon-btn"
                        onClick={() => goDetail(b)}
                        aria-label="View details"
                      >
                        <BookOpen size={14} color="#8FA05C" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
            )}
          </section>
        </>
      )}

      <Footer />
      <ChatBot />

      
    </div>
  );
}
