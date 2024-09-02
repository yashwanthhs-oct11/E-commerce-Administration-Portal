const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

// File type map for allowed image formats
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

// Route to get all products with optional category filter
router.get(`/`, async (req, res) => {
    try {
        let filter = {};
        if (req.query.categories) {
            filter = { category: req.query.categories.split(',') };
        }

        // Retrieve all products with optional filtering and populate category
        const productList = await Product.find(filter).populate('category');

        // Check if products were retrieved
        if (!productList) {
            return res.status(500).json({ success: false });
        }

        // Respond with the list of products
        res.send(productList);
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route to get a specific product by ID
router.get(`/:id`, async (req, res) => {
    try {
        // Find the product by ID and populate category
        const product = await Product.findById(req.params.id).populate('category');

        // Check if the product was found
        if (!product) {
            return res.status(500).json({ success: false });
        }

        // Respond with the product details
        res.send(product);
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route to create a new product with image upload
router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    try {
        // Validate the category
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).send('Invalid Category');

        // Validate the image upload
        const file = req.file;
        if (!file) return res.status(400).send('No image in the request');

        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        // Create a new product with the uploaded image
        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: `${basePath}${fileName}`, // Construct the image URL
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        });

        product = await product.save();

        // Check if the product was created successfully
        if (!product) return res.status(500).send('The product cannot be created');

        // Respond with the newly created product
        res.send(product);
    } catch (error) {
        // Handle unexpected errors
        res.status(500).send('Internal Server Error');
    }
});

// Route to update an existing product by ID
router.put('/:id', async (req, res) => {
    try {
        // Validate the product ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }

        // Validate the category
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).send('Invalid Category');

        // Update the product with the provided details
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
            },
            { new: true }
        );

        // Check if the product was updated successfully
        if (!product) return res.status(500).send('The product cannot be updated!');

        // Respond with the updated product
        res.send(product);
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route to delete a product by ID
router.delete('/:id', async (req, res) => {
    try {
        // Find and remove the product
        const product = await Product.findByIdAndRemove(req.params.id);

        // Check if the product was deleted
        if (product) {
            return res.status(200).json({ success: true, message: 'The product is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'Product not found!' });
        }
    } catch (error) {
        // Handle unexpected errors
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Route to get the count of all products
router.get(`/get/count`, async (req, res) => {
    try {
        // Count the total number of products
        const productCount = await Product.countDocuments();

        // Check if the count was retrieved
        if (!productCount) {
            return res.status(500).json({ success: false });
        }

        // Respond with the product count
        res.send({ productCount: productCount });
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route to get featured products with a limit on count
router.get(`/get/featured/:count`, async (req, res) => {
    try {
        const count = req.params.count ? +req.params.count : 0;

        // Find featured products and limit the number of results
        const products = await Product.find({ isFeatured: true }).limit(count);

        // Check if products were retrieved
        if (!products) {
            return res.status(500).json({ success: false });
        }

        // Respond with the list of featured products
        res.send(products);
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route to update gallery images of a product
router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
    try {
        // Validate the product ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }

        const files = req.files;
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        // Construct image paths for uploaded files
        if (files) {
            imagesPaths = files.map(file => `${basePath}${file.filename}`);
        }

        // Update the product with new gallery images
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { images: imagesPaths },
            { new: true }
        );

        // Check if the product gallery was updated successfully
        if (!product) {
            return res.status(500).send('The gallery cannot be updated!');
        }

        // Respond with the updated product
        res.send(product);
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
