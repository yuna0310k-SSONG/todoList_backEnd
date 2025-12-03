const express = require("express");
const cors = require("cors");
const todosRoutes = require("./routes/todos.routes");

const app = express();
// Strong CORS: reflect request origin when it matches our allowlist, otherwise block
// const allowList = new Set(["https://todolist-backend-qvzu.onrender.com", "http://localhost:3000"]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowList.has(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  // Short-circuit preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Also apply cors middleware with permissive origin function to ensure header formatting
app.use(
  cors({
    origin: ["https://todo-list-front-end-mrvs.vercel.app/"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/todos", todosRoutes);

// Not Found
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

// Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
