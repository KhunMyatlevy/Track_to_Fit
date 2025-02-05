# Fitness Tracker Backend

This is the backend for a Fitness Tracker application, built using Node.js, Express, and MongoDB. The backend provides essential functionalities for user management, session tracking, and exercise tracking. The project is designed to be scalable, with middleware and utility functions to ensure clean code and a smooth user experience.

## Features

- **User Registration 📝**: Allows new users to register with a verified code, ensuring that users are legitimate before gaining access to the application.
- **User Login 🔐**: Authenticated users can log in using their credentials. Upon successful login, a token is issued and sent inside cookies for authorization.
- **User Log-out 🚪**: Allows users to log out, which removes the token from the cookies, effectively ending their session.
- **Session Management 🏋️**: Users can create, read, update, and delete workout sessions.
- **Exercise Tracking 🏃‍♀️**: Users can track their exercises within a session. Each exercise has information such as the exercise name, weight, reps, and the associated session.
- **Token-based Authorization 🔑**: The app uses JWT tokens for secure authentication. Tokens are sent inside cookies to ensure user authorization.
- **CRUD Operations 🔄**: The backend includes full CRUD functionality for both the session and exercise models, allowing users to manage their fitness sessions and exercises efficiently.
- **Scalable Design 📈**: The backend uses multiple middleware functions and utility functions to ensure scalability, maintainability, and easy future improvements.

## Technologies Used

- **Node.js**: JavaScript runtime used to build the backend application.
- **Express**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database to store user, session, and exercise data.
- **JWT**: JSON Web Tokens used for user authentication and authorization.
- **Mongoose**: MongoDB object modeling tool used for defining schemas and querying the database.
- **Cookies**: Cookies are used for storing the authentication token to manage user sessions.

## Endpoints

### Authentication Routes

- **POST /register 📝**: Registers a new user.
- **POST /verify-email 📧**: Verifies the user's email address.
- **POST /login 🔑**: Logs in the user and generates a JWT token.

### Protected Routes 🔒
These routes require the user to be authenticated (logged in) via the JWT token stored in cookies.

- **POST /logout 🚪**: Logs the user out by invalidating their JWT token. (authMiddleware is used to check if the user is logged in)

### Session Routes 🏋️‍♂️

- **POST /create_session 📝**: Creates a new workout session for the authenticated user.
- **GET /fetch_all_sessions 🔍**: Fetches all workout sessions for the authenticated user.
- **GET /fetch_session_by_id/:sessionId 🔎**: Fetches a specific session by its ID for the authenticated user.
- **PUT /update_session_by_id/:sessionId 🔄**: Updates a workout session by its ID for the authenticated user.
- **DELETE /delete_session_by_id/:sessionId ❌**: Deletes a workout session by its ID for the authenticated user.

### Exercise Routes 🏃‍♀️

- **POST /create_exercise 🏋️‍♀️**: Adds a new exercise to a session for the authenticated user.
- **GET /fetch_exercises_by_session/:sessionId 🔍**: Fetches all exercises for a specific session for the authenticated user.
- **GET /fetch_exercise_by_id/:exerciseId 🔎**: Fetches a specific exercise by its ID for the authenticated user.
- **PUT /update_exercise_by_id/:exerciseId 🔄**: Updates a specific exercise by its ID for the authenticated user.
- **DELETE /delete_exercise_by_id/:exerciseId ❌**: Deletes a specific exercise by its ID for the authenticated user.

## Middleware Functions

- **authMiddleware 🔑**: Ensures that the user is authenticated by checking for a valid JWT token in the request cookies. This middleware is used to protect routes that require authentication.
- **checkSessionOwner 🔒**: Verifies that the current authenticated user is the owner of the session by comparing the user ID stored in the JWT token with the user ID associated with the session. This middleware ensures that only the session owner can modify or delete the session.
- **getSessionIdFromRequest 🔎**: Extracts the session ID from the request parameters. This middleware helps ensure that the request is associated with the correct session.
- **getUserFromCookies 🍪**: Retrieves the user ID from the cookies of the request. This middleware gets the current logged-in user's ID based on the JWT token stored in cookies.

## Utility Functions

- **generateVerificationCode 📧**: Generates a random verification code, typically used for email verification during user registration. The code is usually sent to the user via email.
- **generateToken 🔑**: Generates a JWT token to authenticate the user. This token is used to maintain the user's session and is sent in cookies for subsequent requests.
- **sendVerificationEmail 📧**: Sends a verification email to the user containing the verification code. This function is typically used during the user registration process to confirm the user's email address.
