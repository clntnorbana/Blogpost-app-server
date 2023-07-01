const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
// const cors = require("cors");

const blogpostRoute = require("./routes/blogpostRoute");
const userRoute = require("./routes/userRoute");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

dotenv.config();
const PORT = process.env.PORT || 5000;

// express app
const app = express();

app.use(express.json());
// app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  const allowedOrigins = [
    "http://localhost:5173",
    "https://clntn-blogpost-api.onrender.com",
    "http://clntn-blogpost-api.onrender.com",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(__dirname + "/uploads"));

// routers
app.use("/api/blogposts", blogpostRoute);
app.use("/api/users", userRoute);

// error handling middlewares
app.use(notFound);
app.use(errorHandler);

connectDB();
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
