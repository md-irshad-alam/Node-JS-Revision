const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const middleware = require("./config/middleware");
const multer = require("multer");

const path = require("path");
const moviesRoute = express.Router();

const authSchem = mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
});
const movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  releaseYear: { type: Number },
  genre: { type: String },
  director: { type: String },
  rating: { type: Number, min: 0, max: 10 },
  image: { type: String }, // URL to the image
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "auth",
  },
});

const movieModel = mongoose.model("movie", movieSchema);

const blogSchem = mongoose.Schema({
  title: { type: String },
  content: { type: String },
  comment: { type: String },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "auth",
  },
});

const authMode = mongoose.model("auth", authSchem);
const blogModel = mongoose.model("blog", blogSchem);

route.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newuser = await authMode({
      name,
      email,
      password,
    });
    await newuser.save();
    res.send("register Successfull");
  } catch (error) {
    console.error("registeration Error!");
  }
});

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.send({ message: "Email and Password are required" });
    }

    const user = await authMode.findOne({ email });
    if (!user) return res.send({ message: "user not found" });

    console.log(user);

    if (user?.password === password) {
      const token = jwt.sign({ id: user._id }, "secretKey", {
        expiresIn: "1d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // ⚠️ must match the protocol (http)
        sameSite: "lax", // ✅ use 'lax' or 'strict' for localhost
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.send({ message: "login successful" }); // ✅ prevent next line
    }

    res.send({ message: "Invalid Credential" }); // only runs if password doesn't match
  } catch (error) {
    console.error({ message: "Login Error!", error: error });
    res.send({ message: "Login Error!", error: error });
  }
});

route.get("/check", middleware, async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ authenticated: false });
  }
  try {
    const decoded = jwt.verify(token, "secretKey");
    const user = await authMode.findById(decoded.id).select("name");
    res.json({ authenticated: true, user: user ? user.name : null });
  } catch (error) {
    res.json({ authenticated: false });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

moviesRoute.post(
  "/create",
  middleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, releaseYear, genre, director, rating } =
        req.body;
      const userId = req.user;

      const user = await authMode.findById(userId);
      if (!user) return res.send({ message: "user not found" });
      console.log(req);

      let imageUrl = "";
      if (req.file) {
        // Assuming your server serves static files from /uploads
        imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
          req.file.filename
        }`;
      }

      const newMovie = await movieModel({
        title,
        description,
        releaseYear,
        genre,
        director,
        rating,
        createdBy: userId,
        image:
          "https://www.movieposters.com/cdn/shop/files/ballerina_deoabvwb_480x.progressive.jpg?v=1747937597",
      });
      await newMovie.save();
      res.send({ message: "movie created", imageUrl });
    } catch (error) {
      console.error("Movie Creation Error!", error);
      res.send({ message: "Movie Creation Error!", error });
    }
  }
);
moviesRoute.get("/getAll", middleware, async (req, res) => {
  try {
    const userId = req.user;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await authMode.findById(userId).select("-password");
    if (!user) return res.send({ message: "user not found" });

    const movieData = await movieModel
      .find()
      .populate("createdBy")
      .skip(skip)
      .limit(limit);
    const totalMovies = await movieModel.countDocuments();
    res.send({
      message: "all movies get",
      movieData: movieData,
      currentPage: page,
      totalPages: Math.ceil(totalMovies / limit),
    });
  } catch (error) {
    console.error("Movie Retrieval Error!");
    res.send({ message: "get movies Error", error: error });
  }
});
moviesRoute.delete("/delete/:id", middleware, async (req, res) => {
  try {
    const userId = req.user;
    const movieId = req.params.id;

    const movie = await movieModel.findById(movieId);
    if (!movie) {
      return res.status(404).send({ message: "Movie not found" });
    }

    // Optional: Only allow the creator to delete
    if (movie.createdBy.toString() !== userId) {
      return res.status(403).send({ message: "Unauthorized" });
    }

    await movieModel.findByIdAndDelete(movieId);
    res.send({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Movie Deletion Error!", error);
    res.status(500).send({ message: "Movie Deletion Error!", error });
  }
});

module.exports = {
  moviesRoute,
  route,
};
// module.exports = route;
