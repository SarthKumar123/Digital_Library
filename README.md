# Digital Library

[Try the interactive demo — no login required](https://sarthkumar123.github.io/Digital_Library/)

The GitHub Pages deployment runs entirely in your browser. Explore the catalog, search books, borrow and return, manage a wishlist, edit a sample profile, and open Admin Demo to add or delete catalog entries. Reset Demo restores the sample collection. Demo state is local to each browser and is not an authenticated account. Payment screens are simulations; no money is charged. Google sign-in is available only when running the full backend. No Railway service is required for the demo.

The original Java/Spring Boot/MySQL backend remains in `library-backend/`. The frontend selects browser storage when `VITE_DEMO_MODE=true`; `.env.production` enables it for GitHub Pages.

## Run

```sh
cd Frontend
npm ci
VITE_DEMO_MODE=true npm run dev
```

For the full backend, set `VITE_DEMO_MODE=false`, `VITE_API_BASE_URL` and `VITE_BACKEND_URL` for your running Spring Boot service. Build with `npm run build`. GitHub Actions publishes the demo from main.

## Original full-stack project documentation

\# 📚 Digital Library Management System



A full-stack Digital Library Management System built using \*\*React.js\*\*, \*\*Spring Boot\*\*, and \*\*MySQL\*\*. The application allows users to browse books, borrow and return books, track fines, manage profiles, and provides an admin dashboard for managing books, users, and borrow records.



\## 🚀 Features



\### User Features



\* User Registration \& Login

\* Google OAuth Login

\* Browse Books

\* Search \& Filter Books

\* View Book Details

\* Borrow Books

\* Return Books

\* My Books Section

\* Borrow History

\* Fine Management

\* Profile Management

\* Responsive UI



\### Admin Features



\* Dashboard Statistics

\* Add New Books

\* Delete Books

\* Manage Users

\* View Borrow Records

\* Book Inventory Tracking



\### Payment Module



\* Razorpay Payment UI Integration (Demo/Mock Implementation)

\* Fine Payment Success Screen



\## 🛠️ Tech Stack



\### Frontend



\* React.js

\* Vite

\* CSS3

\* Lucide React Icons



\### Backend



\* Java

\* Spring Boot

\* Spring Security

\* Spring Data JPA

\* Hibernate



\### Database



\* MySQL



\### Authentication



\* JWT Authentication

\* Google OAuth 2.0



\## 📂 Project Structure



Digital\_Library



├── Frontend (React + Vite)



└── library-backend (Spring Boot + MySQL)



\## ⚙️ Installation



\### Backend



1\. Open `library-backend`

2\. Configure MySQL credentials in `application.properties`

3\. Run:



```bash

mvn spring-boot:run

```



Backend runs on:



```text

http://localhost:8080

```



\### Frontend



1\. Open `Frontend`

2\. Install dependencies:



```bash

npm install

```



3\. Start application:



```bash

npm run dev

```



Frontend runs on:



```text

http://localhost:5173

```



\## 🗄️ Database



\* MySQL Database

\* Spring Data JPA

\* Hibernate ORM

\* Automatic table creation using JPA entities



\## 🤖 AI Assistance



During development, AI tools were used for:



\* UI design suggestions

\* Code refactoring guidance

\* Debugging support

\* README documentation

\* Feature planning and brainstorming



All architecture decisions, implementation, integration, testing, and customization were performed and validated by the developer.



\## 📸 Screenshots



Add screenshots here:



\* Home Page

\* Books Page

\* Book Details

\* My Books

\* Fine Payment Screen

\* Admin Dashboard



\## 🎯 Learning Outcomes



This project helped strengthen knowledge of:



\* Java Full Stack Development

\* Spring Boot REST APIs

\* Authentication \& Authorization

\* React Component Architecture

\* Database Design

\* API Integration

\* Full Stack Project Deployment

\* Git \& GitHub Workflow



\## 👨‍💻 Developer



\*\*Sarth Kumar\*\*



Aspiring Java Full Stack Developer passionate about building scalable web applications using Java, Spring Boot, React, and MySQL.



