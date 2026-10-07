import { BOOKS } from "./data.js";

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";
const KEY = "digital-library-demo-v1";
const date = (offset = 0) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
const cover = (book) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420"><rect width="300" height="420" fill="#e7e9da"/><rect x="22" y="22" width="256" height="376" fill="#52613b" rx="8"/><text x="150" y="100" text-anchor="middle" fill="#fff" font-family="Georgia" font-size="22">DIGITAL LIBRARY</text><foreignObject x="42" y="160" width="216" height="180"><div xmlns="http://www.w3.org/1999/xhtml" style="color:white;font:28px Georgia;text-align:center">${book.title.replace(/[&<>]/g, "")}</div></foreignObject><text x="150" y="350" text-anchor="middle" fill="#e7e9da" font-size="16">Demo collection</text></svg>`);
function seed() {
  const books = BOOKS.map((b, i) => ({ ...b, id: i + 1, image: cover(b), imageUrl: cover(b), availableCopies: b.copies, totalCopies: b.copies }));
  books[0].copies -= 1;
  books[0].availableCopies -= 1;
  return { books, users: [{ id: 1, name: "Demo Reader", email: "reader@example.com", role: "USER", phone: "", address: "" }], records: [{ id: 1, userId: 1, bookId: 1, borrowedOn: date(-18), dueDate: date(-4), status: "BORROWED" }], wishlist: [2], fines: [] };
}
function read() {
  try { const value = JSON.parse(localStorage.getItem(KEY)); if (value?.books && value?.users && value?.records && value?.wishlist && value?.fines) return value; } catch { /* Restore invalid demo storage. */ }
  const value = seed(); save(value); return value;
}
function save(state) { localStorage.setItem(KEY, JSON.stringify(state)); window.dispatchEvent(new Event("library-demo-change")); }
export function resetDemo() { localStorage.removeItem(KEY); localStorage.removeItem("currentBorrowRecord"); localStorage.setItem("userId", "1"); window.location.reload(); }
function bookById(state, id) { const book = state.books.find(b => b.id === Number(id)); if (!book) throw new Error("Book no longer exists in this demo."); return book; }
const withBook = (state, record) => ({ ...record, book: bookById(state, record.bookId) });
export const demo = {
  fetchBooks: () => read().books,
  getUser: () => read().users[0],
  updateUser: (id, values) => { const s = read(); Object.assign(s.users[0], values); save(s); return s.users[0]; },
  login: () => read().users[0],
  signup: ({ name }) => { const s = read(); s.users[0].name = name || "Demo Reader"; save(s); return s.users[0]; },
  addBook: (values) => { const s = read(); if (!values.title?.trim() || !values.author?.trim() || !Number.isInteger(values.availableCopies) || values.availableCopies < 1) throw new Error("Enter a title, author and positive whole-number quantity."); const b = { ...BOOKS[0], description: "A sample catalog entry added in this browser.", tagline: "Demo catalog entry", ...values, id: Math.max(0, ...s.books.map(b => b.id)) + 1, copies: values.availableCopies, status: "Available", image: values.imageUrl || cover(values) }; b.imageUrl = b.image; s.books.push(b); save(s); return b; },
  updateBook: (id, values) => { const s = read(); const b = bookById(s, id); Object.assign(b, values); save(s); return b; },
  deleteBook: (id) => { const s = read(); if (s.records.some(r => r.bookId === Number(id))) throw new Error("Keep books with borrowing history. Reset the demo to restore the catalog."); s.books = s.books.filter(b => b.id !== Number(id)); s.wishlist = s.wishlist.filter(b => b !== Number(id)); save(s); return true; },
  borrowBook: (userId, bookId) => { const s = read(); const b = bookById(s, bookId); if (s.records.some(r => r.bookId === b.id && r.status === "BORROWED")) throw new Error("You already borrowed this book. Open My Books to return it."); if (b.copies < 1) throw new Error("No copies available."); b.copies--; b.availableCopies = b.copies; b.status = b.copies ? "Available" : "Borrowed"; const r = { id: Math.max(0, ...s.records.map(r => r.id)) + 1, userId: 1, bookId: b.id, borrowedOn: date(), dueDate: date(14), status: "BORROWED" }; s.records.push(r); save(s); return withBook(s, r); },
  returnBook: (id) => { const s = read(); const r = s.records.find(r => r.id === Number(id)); if (!r || r.status !== "BORROWED") throw new Error("This borrowing is no longer active."); const b = bookById(s, r.bookId); b.copies++; b.availableCopies = b.copies; b.status = "Available"; r.status = "RETURNED"; r.returnedOn = date(); const amount = Math.max(0, Math.ceil((new Date(date()) - new Date(r.dueDate)) / 86400000)) * 10; if (amount) s.fines.push({ book: b.title, amount, status: "Paid (simulated)" }); save(s); return "Book returned in demo."; },
  getMyBooks: () => { const s = read(); return s.records.filter(r => r.status === "BORROWED").map(r => withBook(s, r)); },
  getBorrowHistory: () => { const s = read(); return s.records.map(r => withBook(s, r)); },
  getWishlist: () => { const s = read(); return s.wishlist.map(id => ({ ...bookById(s, id), wishlistItemId: id, addedOn: date() })); },
  checkWishlisted: (userId, id) => read().wishlist.includes(Number(id)),
  addToWishlist: (userId, id) => { const s = read(); bookById(s, id); if (!s.wishlist.includes(Number(id))) s.wishlist.push(Number(id)); save(s); return true; },
  removeFromWishlist: (userId, id) => { const s = read(); s.wishlist = s.wishlist.filter(b => b !== Number(id)); save(s); return true; },
  getFines: () => { const s = read(); return [...s.fines, ...s.records.filter(r => r.status === "BORROWED" && r.dueDate < date()).map(r => ({ book: bookById(s, r.bookId).title, amount: Math.max(0, Math.ceil((new Date(date()) - new Date(r.dueDate)) / 86400000)) * 10, status: "Return book to settle (demo)" }))]; },
  getUsers: () => read().users,
  getRecords: () => { const s = read(); return s.records.map(r => ({ ...withBook(s, r), user: s.users[0] })); },
};
