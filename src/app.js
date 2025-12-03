const express = require("express");
const cors = require("cors");
const todosRoutes = require("./routes/todos.routes");

const app = express();

app.use(
  cors({
    origin: ["https://todo-list-front-end-mrvs.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

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
