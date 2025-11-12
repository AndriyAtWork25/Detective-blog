# Sherlocks Blog API 🕵️‍♂️

A production-ready backend project featuring user authentication, email verification, JWT refresh tokens, and CRUD functionality for posts and tasks. Built with Node.js, Express, and MongoDB.  
This project demonstrates a secure and professional authentication flow, designed to showcase the skills of a Junior Full Stack Developer.

---

## 🚀 Live Demo

- 🌐 **API Endpoint:** [detective-blog.onrender.com](https://detective-blog.onrender.com)  
- 📘 **Swagger Docs:** [detective-blog.onrender.com/api-docs](https://detective-blog.onrender.com/api-docs)


---

# 🛠 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt, refresh tokens
- **Email:** SendGrid for verification emails
- **Validation & Security:** express-validator, rate limiter, middleware for auth
- **Logging:** morgan
- **Documentation:** Swagger (OpenAPI)
- **Testing:** Jest / Supertest (unit & integration tests)

---

# ⚡ Features

### Authentication & User Flow
- User registration with hashed passwords
- Email verification via SendGrid
- Login with JWT access tokens
- Refresh tokens for extended sessions
- Logout functionality (invalidate refresh tokens)
- Resend verification email endpoint

### Posts & Tasks
- Create, read, update, delete posts
- Optional tasks model (planned for future features)

### API & Documentation
- Fully documented API using Swagger
- Rate limiting for sensitive endpoints
- Middleware for token verification and request validation

### Extras
- Professional HTML email templates for verification
- Clean folder structure separating controllers, routes, models, middleware, utils, and emails
- Logging of requests and errors for better debugging

---

# 🚀 Installation / Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/sherlocks-blog-api.git
cd sherlocks-blog-api
```
2. Install dependecies:
```bash
  npm install
 ```
3. Create an .env file in the root directory and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_USER=your_email_for_nodemailer
EMAIL_PASS=your_email_password_or_app_password
FRONTEND_URL=http://localhost:5000

4. Start the Server:

```bash
  npm start
 ```

 5. Server should run at:

 http://localhost:5000
 Swagger docs available at: http://localhost:5000/swagger

 # Usage

- Register a new user via /api/auth/register
- Verify email via /api/auth/verify-email?token=...
- Login via /api/auth/login
- Use JWT access token for protected endpoints (Authorization: Bearer <token>)
- Refresh token via /api/auth/refresh-token
- Logout via /api/auth/logout
- All routes and request/response structures are documented in Swagger.

# Testing

- npm test

Tests cover authentication and post-related functionality. More tests can be added for future features.

# Swagger Documentation

API documentation is available at:

http://localhost:5000/swagger

You can test endpoints directly through Swagger UI.

# Future Improvements

- Add user roles and permissions
- Implement refresh token expiry and cleanup
- Expand task management functionality
- Add frontend integration (React / Next.js)
- Improve unit & integration test coverage

 ## Author 
 
 Developed by Andriy — Junior Back End Developer passionate about building practical web applications with modern JavaScript technologies.
"Solving problems one endpoint at a time." 🕵️‍♂️
