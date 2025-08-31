# Project Showcase Platform

A full-stack web application for showcasing and rating projects, built with Node.js/Express backend and vanilla JavaScript frontend.

## Features

### Backend Features
- ✅ User authentication with JWT
- ✅ Email verification with OTP
- ✅ Project CRUD operations
- ✅ Project rating system (1-10 scale)
- ✅ Like/View tracking
- ✅ Search and pagination
- ✅ File upload support
- ✅ Email notifications
- ✅ Rate limiting and security
- ✅ Input validation and error handling

### Frontend Features
- ✅ Responsive design with mobile navigation
- ✅ User registration and login
- ✅ Project showcase with dynamic loading
- ✅ Interactive rating system
- ✅ Real-time project interactions
- ✅ User dashboard and profile management
- ✅ Project creation and management
- ✅ Modern UI with animations

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **nodemailer** - Email service
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **HTML5** - Semantic markup
- **CSS3** - Styling and animations
- **Font Awesome** - Icons
- **Local Storage** - Client-side data persistence

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Project_S
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env file in backend directory
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/project_showcase
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password_here
   SENDER_NAME=Project Showcase
   SENDER_EMAIL=your_email@gmail.com
   CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:5500,http://localhost:5500
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Run the backend server**
   ```bash
   npm start
   # or for development with nodemon
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../Frontend
   ```

2. **Serve the frontend**
   ```bash
   # Using Python (if available)
   python -m http.server 5500
   
   # Using Node.js serve (install globally first)
   npx serve -p 5500
   
   # Using Live Server extension in VS Code
   # Right-click on home.htm and select "Open with Live Server"
   ```

3. **Access the application**
   - Open `http://localhost:5500/home.htm` in your browser

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### OTP
- `POST /api/otp/send` - Send OTP to email
- `POST /api/otp/verify` - Verify OTP

### Projects
- `GET /api/projects` - Get all projects (with pagination/search)
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/rate` - Rate a project
- `POST /api/projects/:id/like` - Like/unlike project
- `POST /api/projects/:id/view` - Record project view

## Project Structure

```
Project_S/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── otpController.js
│   │   └── projectController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── ownerGuard.js
│   │   ├── rateLimit.js
│   │   └── validation.js
│   ├── models/
│   │   ├── OTP.js
│   │   ├── Project.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── index.js
│   │   ├── otp.js
│   │   └── projects.js
│   ├── utils/
│   │   ├── emailService.js
│   │   ├── hashIp.js
│   │   └── mailer.js
│   ├── package.json
│   ├── server.js
│   └── seedData.js
├── Frontend/
│   ├── home.htm
│   ├── login.htm
│   ├── signup.htm
│   ├── projects.htm
│   ├── user.htm
│   ├── profile.htm
│   ├── home.js
│   ├── auth.js
│   ├── projects.js
│   ├── user.js
│   ├── profile.js
│   ├── home.css
│   ├── auth.css
│   ├── projects.css
│   ├── user.css
│   ├── profile.css
│   └── images/
└── README.md
```

## Usage

### For Users
1. **Register/Login** - Create an account or sign in
2. **Browse Projects** - View and search through projects
3. **Rate Projects** - Give ratings from 1-10
4. **Like Projects** - Show appreciation for projects
5. **View Details** - Click on projects to see more information

### For Project Creators
1. **Create Projects** - Add your projects with descriptions and links
2. **Manage Projects** - Edit or delete your projects
3. **Track Performance** - Monitor ratings and views
4. **Update Profile** - Keep your information current

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Email Verification** - OTP-based email verification
- **Rate Limiting** - Prevent abuse and spam
- **Input Validation** - Sanitize and validate all inputs
- **CORS Protection** - Configured cross-origin requests
- **Security Headers** - Helmet for additional security

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

**Note**: Make sure to configure your email settings properly for OTP functionality to work. For Gmail, you'll need to use an App Password instead of your regular password.
