# Neon Arcade Nexus

A production-ready, futuristic multiplayer gaming platform built with **Next.js 14**, **Convex**, and **TailwindCSS**.

## 🚀 Getting Started

### 1. Install Dependencies
Make sure you have Node.js installed.
```bash
npm install
```

### 2. Setup Convex Backend
Initialize the Convex backend. You will be prompted to log in and create a project.
```bash
npx convex dev
```
This command will:
- configure your Convex project
- create a `.env.local` file with your `NEXT_PUBLIC_CONVEX_URL` url
- push the schema and functions

### 3. Run the App
Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to enter the arcade.

## 🎮 Features & Structure
- **Authentication**: Powered by Convex Auth (Google, GitHub, Password).
- **Real-time Engine**: Convex handles game state syncing (millisecond latency).
- **Styling**: Tailored Neon aesthetics using TailwindCSS + CSS Variables.
- **Games**:
  - **Tic Tac Toe**: Supports AI and Online modes.
  - **Modules**: Extensible architecture for adding Pong, Memory, etc.

## 📱 Mobile Support
This app is fully responsive and PWA-ready.
