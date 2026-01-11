# Doubtly 📚

A full-stack classroom doubt tracking system where students can raise doubts and teachers can answer them. Built with React, Node.js, Express, and MongoDB.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-v19-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/License-ISC-yellow)

## 🌐 Live Demo

- **Frontend**: [https://doubtly-mu.vercel.app](https://doubtly-mu.vercel.app)
- **Backend API**: Deployed on Render

---

## ✨ Features

### For Students
- 📝 Raise doubts with title, description, and subject
- 📎 Attach media (images, audio, video) to doubts
- 👍 Upvote doubts to prioritize important questions
- ✏️ Edit or delete doubts before they are answered
- 🔍 Filter doubts by subject and status

### For Teachers
- 💬 Answer student doubts with text and media
- ✏️ Edit or delete their own answers
- 👀 View all doubts across the platform

### Authentication
- 🔐 JWT-based authentication
- 🔑 Google OAuth 2.0 login
- 👤 Role-based access (Student/Teacher)

---

## 🏗️ Project Structure

```
Doubtly/
├── backend/
│   ├── api/
│   │   └── index.js              # Vercel serverless entry point
│   ├── src/
│   │   ├── server.js             # Express server entry
│   │   ├── app.js                # Express app configuration
│   │   ├── config/
│   │   │   ├── db.js             # MongoDB connection
│   │   │   ├── cloudinary.js     # Cloudinary configuration
│   │   │   └── passport.js       # Google OAuth strategy
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── doubt.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT protection
│   │   │   ├── role.middleware.js    # Role-based access
│   │   │   ├── multer.js             # File upload handling
│   │   │   └── upload.middleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Doubt.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── authOAuthRoutes.js
│   │   │   └── doubt.routes.js
│   │   └── utils/
│   │       ├── generateToken.js
│   │       └── uploadToCloudinary.js
│   ├── package.json
│   └── vercel.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── main.jsx              # React entry point
│   │   ├── App.jsx               # Root component
│   │   ├── index.css             # Global styles
│   │   ├── components/
│   │   │   ├── answers/
│   │   │   │   └── AnswerBox.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── OAuthButton.jsx
│   │   │   ├── common/
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── RoleCheck.jsx
│   │   │   └── doubts/
│   │   │       ├── AskDoubtForm.jsx
│   │   │       ├── DoubtCard.jsx
│   │   │       ├── DoubtFilters.jsx
│   │   │       └── DoubtList.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── AuthContextCreator.js
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DoubtDetail.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── OAuthSuccess.jsx
│   │   │   └── Unauthorized.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.service.js
│   │   │   └── doubt.service.js
│   │   └── utils/
│   │       └── constants.js
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
└── README.md
```

---

## 📊 Database Schema

### User Schema

| Field      | Type     | Description                          |
|------------|----------|--------------------------------------|
| `name`     | String   | User's full name (required)          |
| `email`    | String   | Unique email address (required)      |
| `password` | String   | Hashed password (required if no OAuth) |
| `googleId` | String   | Google OAuth ID (optional)           |
| `avatar`   | String   | Profile picture URL                  |
| `role`     | String   | `student` or `teacher` (default: student) |
| `createdAt`| Date     | Timestamp                            |
| `updatedAt`| Date     | Timestamp                            |

### Doubt Schema

| Field        | Type       | Description                              |
|--------------|------------|------------------------------------------|
| `title`      | String     | Doubt title (max 120 chars, required)    |
| `description`| String     | Detailed description (required)          |
| `subject`    | String     | Subject/topic (required, indexed)        |
| `student`    | ObjectId   | Reference to User who raised the doubt   |
| `status`     | String     | `open`, `answered`, or `resolved`        |
| `upvotes`    | [ObjectId] | Array of User IDs who upvoted            |
| `media`      | Array      | Attached media files                     |
| `answers`    | Array      | Array of answer objects                  |
| `createdAt`  | Date       | Timestamp                                |
| `updatedAt`  | Date       | Timestamp                                |

#### Media Object
```javascript
{
  url: String,       // Cloudinary URL
  mediaType: String  // "image" | "audio" | "video"
}
```

#### Answer Object
```javascript
{
  text: String,           // Answer text
  media: [MediaObject],   // Attached media
  teacher: ObjectId,      // Reference to teacher User
  createdAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint              | Description              | Access  |
|--------|-----------------------|--------------------------|---------|
| POST   | `/api/auth/register`  | Register new user        | Public  |
| POST   | `/api/auth/login`     | Login with email/password| Public  |
| GET    | `/api/auth/me`        | Get current user profile | Protected |

### Google OAuth

| Method | Endpoint                  | Description                    | Access  |
|--------|---------------------------|--------------------------------|---------|
| GET    | `/auth/google`            | Initiate Google OAuth          | Public  |
| GET    | `/auth/google/callback`   | Google OAuth callback          | Public  |

**Query Parameters for `/auth/google`:**
- `role` - `student` or `teacher` (default: student)

### Doubts

| Method | Endpoint                    | Description                    | Access    |
|--------|-----------------------------|--------------------------------|-----------|
| POST   | `/api/doubts`               | Create a new doubt             | Student   |
| GET    | `/api/doubts`               | Get all doubts                 | Protected |
| PUT    | `/api/doubts/:id`           | Update a doubt                 | Student (owner) |
| DELETE | `/api/doubts/:id`           | Delete a doubt                 | Student (owner) |
| PUT    | `/api/doubts/:id/upvote`    | Toggle upvote on a doubt       | Protected |
| PUT    | `/api/doubts/:id/answer`    | Answer a doubt                 | Teacher   |
| PUT    | `/api/doubts/:id/answer/edit` | Edit your answer             | Teacher   |
| DELETE | `/api/doubts/:id/answer`    | Delete your answer             | Teacher   |

### Request/Response Examples

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

#### Create Doubt (with media)
```bash
POST /api/doubts
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: "How does React hooks work?"
description: "I'm confused about useState and useEffect..."
subject: "React"
media: [file1.png, file2.mp3]
```

#### Answer Doubt
```bash
PUT /api/doubts/:id/answer
Authorization: Bearer <token>
Content-Type: multipart/form-data

answer: "React hooks are functions that..."
media: [explanation.png]
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB Atlas account
- Cloudinary account
- Google Cloud Console project (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/doubtly.git
   cd doubtly
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Backend Environment**
   
   Create `.env` in `backend/`:
   ```env
   # Server Configuration
   PORT=8001
   NODE_ENV=development

   # Database
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/doubtly

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:8001/auth/google/callback

   # Frontend URL (for CORS and OAuth redirect)
   FRONTEND_URL=http://localhost:5173
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure Frontend Environment**
   
   Create `.env` in `frontend/`:
   ```env
   VITE_API_BASE_URL=http://localhost:8001
   ```

6. **Run Development Servers**

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend (new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

7. **Open the app**
   
   Navigate to [http://localhost:5173](http://localhost:5173)

---

## 🌍 Deployment

### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set root directory to `frontend`
3. Add environment variable:
   - `VITE_API_BASE_URL=https://your-backend-url.com`
4. Deploy

### Backend (Render / Vercel)

1. Connect your GitHub repo
2. Set root directory to `backend`
3. Add all environment variables from `.env`
4. Update `GOOGLE_CALLBACK_URL` and `FRONTEND_URL` with production URLs
5. Deploy

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://your-frontend.vercel.app` (production)
6. Add authorized redirect URIs:
   - `http://localhost:8001/auth/google/callback` (development)
   - `https://your-backend.com/auth/google/callback` (production)

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Passport.js** - Authentication
- **JWT** - Token-based auth
- **Cloudinary** - Media storage
- **Multer** - File uploads

---

## 👤 Author

**Krishna Verma**

---

## 📄 License

This project is licensed under the ISC License.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Support

For support, email krishnavermaambala05@gmail.com or open an issue on GitHub.
