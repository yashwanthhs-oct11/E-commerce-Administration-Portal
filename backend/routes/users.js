const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Route to get all users without their password hashes
router.get(`/`, async (req, res) => {
  try {
    // Retrieve all users and exclude the passwordHash field
    const userList = await User.find().select("-passwordHash");

    // Check if users were retrieved successfully
    if (!userList) {
      return res.status(500).json({ success: false });
    }

    // Respond with the list of users
    res.send(userList);
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to get a specific user by ID without their password hash
router.get("/:id", async (req, res) => {
  try {
    // Find the user by ID and exclude the passwordHash field
    const user = await User.findById(req.params.id).select("-passwordHash");

    // Check if the user was found
    if (!user) {
      return res
        .status(500)
        .json({ message: "The user with the given ID was not found." });
    }

    // Respond with the user's details
    res.status(200).send(user);
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to create a new user
router.post("/", async (req, res) => {
  try {
    // Create a new user with hashed password
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    user = await user.save();

    // Check if the user was created successfully
    if (!user) return res.status(400).send("The user cannot be created!");

    // Respond with the newly created user
    res.send(user);
  } catch (error) {
    // Handle unexpected errors
    res.status(500).send("Internal Server Error");
  }
});

// Route to update an existing user by ID
router.put("/:id", async (req, res) => {
  try {
    // Check if the user exists
    const userExist = await User.findById(req.params.id);
    let newPassword;
    if (req.body.password) {
      // Hash the new password if provided
      newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
      // Use the existing password hash if no new password is provided
      newPassword = userExist.passwordHash;
    }

    // Update the user's details
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        passwordHash: newPassword,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
      },
      { new: true }
    );

    // Check if the user was updated successfully
    if (!user) return res.status(400).send("The user cannot be updated!");

    // Respond with the updated user
    res.send(user);
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to log in a user and generate a JWT token
router.post("/login", async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.secret;

    // Check if the user exists and password matches
    if (!user) {
      return res.status(400).send("The user not found");
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      // Generate a JWT token with user ID and admin status
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        secret,
        { expiresIn: "1d" }
      );

      // Respond with user email and token
      res.status(200).send({ user: user.email, token: token });
    } else {
      res.status(400).send("Password is wrong!");
    }
  } catch (error) {
    // Handle unexpected errors
    res.status(500).send("Internal Server Error");
  }
});

// Route to register a new user
router.post("/register", async (req, res) => {
  try {
    // Create a new user with hashed password
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    user = await user.save();

    // Check if the user was created successfully
    if (!user) return res.status(400).send("The user cannot be created!");

    // Respond with the newly created user
    res.send(user);
  } catch (error) {
    // Handle unexpected errors
    res.status(500).send("Internal Server Error");
  }
});

// Route to delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    // Find and remove the user by ID
    const user = await User.findByIdAndRemove(req.params.id);

    // Check if the user was deleted
    if (user) {
      return res
        .status(200)
        .json({ success: true, message: "The user is deleted!" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
  } catch (error) {
    // Handle unexpected errors
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Route to get the count of all users
router.get(`/get/count`, async (req, res) => {
  try {
    // Count the total number of users
    const userCount = await User.countDocuments();

    // Check if the count was retrieved successfully
    if (!userCount) {
      return res.status(500).json({ success: false });
    }

    // Respond with the user count
    res.send({ userCount: userCount });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
