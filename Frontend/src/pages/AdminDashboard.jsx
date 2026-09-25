import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  ArrowLeftRight,
  BarChart3,
  LogOut
} from "lucide-react";
import "./AdminDashboard.css";

const SIDEBAR_ITEMS = [
  { label: "Dashboard", icon: BarChart3 },
  { label: "Books", icon: BookOpen },
  { label: "Users", icon: Users },
  { label: "Borrow Records", icon: ArrowLeftRight }
];

export default function AdminDashboard({ onExitAdmin }) {
  const [active, setActive] = useState("Dashboard");

  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    quantity: "",
    imageUrl: ""
  });

  useEffect(() => {
    loadBooks();
    loadUsers();
    loadRecords();
  }, []);

  const loadBooks = async () => {
    const res = await fetch("http://localhost:8080/api/books");
    setBooks(await res.json());
  };

  const loadUsers = async () => {
    const res = await fetch("http://localhost:8080/api/users");
    setUsers(await res.json());
  };

  const loadRecords = async () => {
    const res = await fetch("http://localhost:8080/api/borrow/all");
    setRecords(await res.json());
  };

  const addBook = async () => {
    await fetch("http://localhost:8080/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: form.title,
        author: form.author,
        category: form.category,
        isbn: form.isbn,
        imageUrl: form.imageUrl,
        totalCopies: Number(form.quantity),
        availableCopies: Number(form.quantity)
      })
    });

    loadBooks();

    setForm({
      title: "",
      author: "",
      category: "",
      isbn: "",
      quantity: "",
      imageUrl: ""
    });
  };

  const deleteBook = async (id) => {
    await fetch(`http://localhost:8080/api/books/${id}`, {
      method: "DELETE"
    });

    loadBooks();
  };

  const deleteUser = async (id) => {
    await fetch(`http://localhost:8080/api/users/${id}`, {
      method: "DELETE"
    });

    loadUsers();
  };

  return (
    <div className="admin-container">

      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2 className="admin-logo">📚 Digital Library</h2>

        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`sidebar-btn ${
              active === item.label ? "active" : ""
            }`}
            onClick={() => setActive(item.label)}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}

        <button className="logout-btn" onClick={onExitAdmin}>
          <LogOut size={18} />
          <span>Exit Admin</span>
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">

        {active === "Dashboard" && (
          <>
            <h1>Dashboard</h1>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>{books.length}</h3>
                <p>Total Books</p>
              </div>

              <div className="stat-card">
                <h3>{users.length}</h3>
                <p>Total Users</p>
              </div>

              <div className="stat-card">
                <h3>{records.length}</h3>
                <p>Borrow Records</p>
              </div>
            </div>
          </>
        )}

        {active === "Books" && (
          <>
            <h1>Manage Books</h1>

            <div className="form-grid">
              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <input
                placeholder="Author"
                value={form.author}
                onChange={(e) =>
                  setForm({ ...form, author: e.target.value })
                }
              />

              <input
                placeholder="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              />

              <input
                placeholder="ISBN"
                value={form.isbn}
                onChange={(e) =>
                  setForm({ ...form, isbn: e.target.value })
                }
              />

              <input
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
              />

              <input
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm({ ...form, imageUrl: e.target.value })
                }
              />
            </div>

            <button className="add-btn" onClick={addBook}>
              Add Book
            </button>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.id}</td>

                    <td>
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="book-thumb"
                      />
                    </td>

                    <td>{book.title}</td>
                    <td>{book.author}</td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteBook(book.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {active === "Users" && (
          <>
            <h1>Users</h1>

            {/* FIX: this was showing books.map(...) with book fields
                and deleteBook -- a leftover copy-paste from the Books
                tab. It now shows real users from the users state,
                using deleteUser. */}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {active === "Borrow Records" && (
          <>
            <h1>Borrow Records</h1>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Book</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.user?.name}</td>
                    <td>{record.book?.title}</td>
                    <td>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

      </div>
    </div>
  );
}
