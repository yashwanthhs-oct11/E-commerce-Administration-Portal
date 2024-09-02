const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

// Route to get all categories
router.get(`/`, async (req, res) => {
  try {
    // Retrieve all categories from the database
    const categoryList = await Category.find();

    // Check if the list is empty or an error occurred
    if (!categoryList) {
      return res.status(500).json({ success: false });
    }

    // Respond with the list of categories
    res.status(200).send(categoryList);
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to get a specific category by ID
router.get("/:id", async (req, res) => {
  try {
    // Find the category by ID
    const category = await Category.findById(req.params.id);

    // Check if the category was not found
    if (!category) {
      return res
        .status(404)
        .json({ message: "The category with the given ID was not found." });
    }

    // Respond with the category
    res.status(200).send(category);
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to create a new category
router.post("/", async (req, res) => {
  console.log("endpoint hit");
  try {
    // Create a new category instance
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });

    // Save the new category to the database
    category = await category.save();

    // Respond with the newly created category
    res.status(201).send(category);
  } catch (error) {
    // Handle unexpected errors
    console.error("Error creating category:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to update an existing category by ID
router.put("/:id", async (req, res) => {
  try {
    // Update the category by ID
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon, // Allow icon to be updated; if not provided, use existing value
        color: req.body.color,
      },
      { new: true } // Return the updated category
    );

    // Check if the category was not found
    if (!category)
      return res.status(400).send("The category cannot be updated!");

    // Respond with the updated category
    res.status(200).send(category);
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to delete a category by ID
router.delete("/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      // Check if the category was deleted
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "The category is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Category not found!" });
      }
    })
    .catch((err) => {
      // Handle unexpected errors
      return res.status(500).json({ success: false, error: err.message });
    });
});

module.exports = router;
