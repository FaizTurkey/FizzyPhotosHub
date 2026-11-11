# 📸 FizzyPhotosHub – Personal Photo Management Platform

**FizzyPhotosHub** is a full-stack photo management web application built using the **MERN Stack**. It allows users to securely upload, organize, manage, and store their photos in one place.

Users can create albums, mark photos as favorites, and manage deleted photos through a dedicated trash system. The application uses **JWT Authentication** for secure user access and **ImageKit.io** for image storage and delivery.

## 🚀 Live Demo

🌐 **Live Website:** https://client-amber-zeta.vercel.app/

📂 **GitHub Repository:** https://github.com/FaizTurkey/FizzyPhotosHub

## ✨ Features

- 🔐 **User Authentication**
  - Secure Sign Up and Sign In functionality.
  - Sign Out functionality.
  - JWT-based authentication for secure access.

- 📤 **Photo Upload**
  - Upload photos easily.
  - Store and manage images using ImageKit.io.
  - Access uploaded photos in your personal gallery.

- 📁 **Album Management**
  - Create albums to organize photos.
  - Manage photos in different albums.
  - Keep your photo collection organized.

- ❤️ **Favorite Photos**
  - Mark any photo as a favorite.
  - Easily access your favorite photos whenever needed.

- 🗑️ **Trash Management**
  - Move unwanted photos to Trash.
  - Restore deleted photos whenever needed.
  - Permanently delete photos from Trash.

- ☁️ **Image Storage**
  - Integrated with ImageKit.io.
  - Efficient image storage and delivery.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| MongoDB | Database |
| Express.js | Backend Framework |
| React.js | Frontend Library |
| Node.js | Backend Runtime |
| JWT | Authentication |
| ImageKit.io | Image Storage and Delivery |

**Architecture:** MERN (MongoDB, Express.js, React.js, Node.js)

## 📂 Project Structure

```text
FizzyPhotosHub/
│
├── client/          # React Frontend
│
├── server/          # Node.js & Express Backend
│
├── .gitignore
│
└── README.md
```

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

**1. Clone the Repository**

```bash
git clone https://github.com/FaizTurkey/FizzyPhotosHub.git
```

**2. Navigate to the Project**

```bash
cd FizzyPhotosHub
```

**3. Install Frontend Dependencies**

```bash
cd client
npm install
```

**4. Install Backend Dependencies**

Open another terminal:

```bash
cd server
npm install
```

**5. Configure Environment Variables**

Create a `.env` file inside the server folder and configure your MongoDB, JWT, and ImageKit credentials according to the environment variable names used in the source code.

Never share your secret keys or commit your `.env` file to GitHub.

**6. Run the Application**

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

## 🔒 Security

- JWT-based authentication.
- Protected access to user-specific resources.
- Environment variables for sensitive credentials.
- Secure management of user photos.

## 🎯 Project Goals

The main goal of FizzyPhotosHub is to provide users with a simple and secure platform where they can upload, organize, manage, and access their personal photo collections.

This project also demonstrates practical implementation of full-stack web development concepts, REST APIs, authentication, database management, and third-party cloud image integration.

## 👨‍💻 Developer

**Mohammad Faiz**

Full Stack Web Developer | MERN Stack Developer

- GitHub: [@FaizTurkey](https://github.com/FaizTurkey)
- Project: [FizzyPhotosHub](https://github.com/FaizTurkey/FizzyPhotosHub)

---

⭐ If you like this project, don't forget to give it a star!

**Built with ❤️ using the MERN Stack.**
