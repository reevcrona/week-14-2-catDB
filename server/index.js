import express from "express";
import mongoose, { Schema } from "mongoose";
import cors from "cors";

const app = express();

const port = 3000;

const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(express.json());
app.use(cors(corsOptions));

mongoose
  .connect("mongodb://localhost:27017/catDB")
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("There was an error connecting to the database");
  });

const catSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  imageUrl: String,
});

const Cat = mongoose.model("Cat", catSchema);

const validateBodyNotEmpty = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: "Request body cannot be empty",
    });
  }
  next();
};

app.get("/cats", async (req, res) => {
  try {
    const cats = await Cat.find();
    res.json(cats);
  } catch (error) {
    console.error("Failed to fech all cats");
    res.status(500).json({
      error: "Unexpected error occured when trying to fetch all cats",
    });
  }
});

app.post("/add-cat", async (req, res) => {
  try {
    const newCat = new Cat(req.body);
    await newCat.save();
    res
      .status(201)
      .json({ message: "Successfully added cat to the database", cat: newCat });
  } catch (error) {
    console.error("Failed to add cat to database");

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: Object.values(error.errors).map((err) => err.message),
      });
    }
    res.status(500).json({ error: "Failed to add cat to database" });
  }
});

app.put("/update-cat/:id", validateBodyNotEmpty, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedCat = await Cat.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedCat) {
      return res.status(404).json({ error: "Did not find the Cat" });
    }
    res
      .status(200)
      .json({ message: "Succesfully updated cat information", updatedCat });
  } catch (error) {
    console.error("Failed to update cat information");
    res.status(500).json({
      error: "Unexpected error occured when updating cat information",
    });
  }
});

app.delete("/delete-cat/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Cat.findByIdAndDelete(id);
    res.status(200).json({ message: "Successfully removed cat from database" });
  } catch (error) {
    console.error("Failed to delete cat from database", error);
    res.status(500).json({
      error: "Failed to delete cat from database, make sure the id is correct",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
