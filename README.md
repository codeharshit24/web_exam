# Web Exam

Express, MongoDB, EJS, JOI and Passport based movie management project.

## Features

- User registration and login with Passport local strategy
- Session based authentication
- JOI server-side validation for register, login and movie forms
- Movie create, read, update and delete flows
- `movieName` stays readonly during updates
- Folder structure with `models`, `routes`, `views`, `public`, and `config`

## Run Locally

1. Copy `.env.example` to `.env`
2. Add your MongoDB connection string and session secret
3. Install dependencies with `npm install`
4. Start the server with `npm start`
