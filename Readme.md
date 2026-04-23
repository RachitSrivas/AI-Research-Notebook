# AI-Powered Research Notebook

A full-stack application that allows users to securely save research notes and automatically generates concise, one-sentence summaries using the Mistral AI API. 

## Features
- **User Authentication:** Secure signup and login using JWT and bcrypt.
- **Smart Summarization:** Integrates Mistral AI to process and summarize text.
- **Persistent Storage:** MongoDB Atlas database for user and note management.
- **Modern UI:** Built with React and Tailwind CSS for a responsive design.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **AI Integration:** Mistral AI API

## How to Run Locally
1. Clone the repository.
2. Navigate to the `backend` directory, run `npm install`, and create a `.env` file with `PORT`, `MONGO_URI`, `JWT_SECRET`, and `MISTRAL_API_KEY`. Run `npm run dev`.
3. Navigate to the `frontend` directory, run `npm install`, and run `npm run dev`.