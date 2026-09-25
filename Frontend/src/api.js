const API_BASE = "http://localhost:8080/api";

function adaptBook(backendBook) {
  return {
    id: backendBook.id,
    title: backendBook.title,
    author: backendBook.author,
    category: backendBook.category,

    status:
      backendBook.availableCopies > 0
        ? "Available"
        : "Borrowed",

    bg: backendBook.coverColor || "#F1EFE4",
    accent: "#4C5B3A",

    sub: backendBook.description
      ? backendBook.description.slice(0, 90)
      : null,

    tagline: backendBook.description
      ? backendBook.description.slice(0, 60)
      : "",

    rating: 4.5,
    ratingCount: 100,

    copies: backendBook.availableCopies ?? 0,

    publisher: backendBook.publisher,
    language: backendBook.language,
    pages: backendBook.pages,
    isbn: backendBook.isbn,

    borrowDuration: 14,
    lateFine: 10,

    description: backendBook.description || "",

    takeaways: [],

    // BOOK IMAGE
    image: backendBook.imageUrl,
  };
}

/* ===========================
   BOOK APIs
=========================== */

export async function fetchBooks() {
  console.log("BORROW URL =", "http://localhost:8080/api/borrow");
  console.log("Fetching from:", `${API_BASE}/books`);

  const res = await fetch(`${API_BASE}/books`);

  console.log("Status:", res.status);

  if (!res.ok) {
    throw new Error(`Failed to fetch books: ${res.status}`);
  }

  const data = await res.json();

  console.log("Books:", data);

  return data.map(adaptBook);
}

export async function addBook(bookData) {
  const res = await fetch(`${API_BASE}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
  });

  if (!res.ok) {
    throw new Error("Failed to add book");
  }

  return await res.json();
}

export async function updateBook(id, bookData) {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
  });

  if (!res.ok) {
    throw new Error("Failed to update book");
  }

  return await res.json();
}

export async function deleteBook(id) {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete book");
  }

  return true;
}

/* ===========================
   AUTH APIs
=========================== */

export async function signup({ name, email, password }) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data || (await res.text().catch(() => "Signup failed"));

    throw new Error(
      typeof message === "string"
        ? message
        : "Signup failed"
    );
  }

  return data;
}

export async function login({ email, password }) {

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json().catch(() => null);

  console.log("LOGIN RESPONSE =", data); // ADD THIS

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return data;
}

/* ===========================
   USER PROFILE APIs
=========================== */

export async function getUser(id) {
  const res = await fetch(`${API_BASE}/users/${id}`);

  if (!res.ok) {
    throw new Error("Failed to load profile");
  }

  return await res.json();
}

export async function updateUser(id, profileData) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  return await res.json();
}

export async function borrowBook(userId, bookId) {

  const response = await fetch(
    "http://localhost:8080/api/borrow",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        bookId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Borrow failed");
  }

  return await response.json();
}
export async function returnBook(borrowId) {
  const response = await fetch(
    `${API_BASE}/borrow/return/${borrowId}`,
    {
      method: "PUT",
    }
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text);
  }

  return text;
}
export async function getMyBooks(userId) {
  const response = await fetch(
    `${API_BASE}/borrow/user/${userId}`
  );

  if (!response.ok) {
    throw new Error("Failed to load borrowed books");
  }

  return await response.json();
}

/**
 * Every borrow this user has ever made, returned or not -- for the
 * Borrow History page. Unlike getMyBooks() above, this doesn't
 * filter by status.
 */
export async function getBorrowHistory(userId) {
  const response = await fetch(`${API_BASE}/borrow/history/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to load borrow history");
  }

  return await response.json();
}

/* ===========================
   WISHLIST APIs
=========================== */

/**
 * Returns this user's wishlist, with each book already reshaped by
 * adaptBook() so the Wishlist page can reuse the exact same book
 * card styling as everywhere else in the app.
 */
export async function getWishlist(userId) {
  const res = await fetch(`${API_BASE}/wishlist/user/${userId}`);

  if (!res.ok) {
    throw new Error("Failed to load wishlist");
  }

  const data = await res.json();
  return data.map((item) => ({
    wishlistItemId: item.id,
    addedOn: item.addedOn,
    ...adaptBook(item.book),
  }));
}

/**
 * Used on the Book Detail page to decide whether the heart icon
 * should start filled in when the page loads.
 */
export async function checkWishlisted(userId, bookId) {
  if (!userId) return false;
  const res = await fetch(`${API_BASE}/wishlist/check?userId=${userId}&bookId=${bookId}`);
  if (!res.ok) return false;
  const data = await res.json();
  return data.wishlisted;
}

export async function addToWishlist(userId, bookId) {
  const res = await fetch(`${API_BASE}/wishlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, bookId }),
  });

  if (!res.ok && res.status !== 409) {
    throw new Error("Failed to add to wishlist");
  }

  return true;
}

export async function removeFromWishlist(userId, bookId) {
  const res = await fetch(`${API_BASE}/wishlist/user/${userId}/book/${bookId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to remove from wishlist");
  }

  return true;
}