const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    updateProductVariants,
    deleteProduct,
} = require('../controllers/product.controller');
const { protect, admin } = require('../middleware/auth');

//public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

//admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.put('/:id/variants', protect, admin, updateProductVariants);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;