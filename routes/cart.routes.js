const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    removeFromCart,
} = require('../controllers/cart.controller.js');
const { protect } = require('../middleware/auth.js');

//protected routes
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.delete('/:variantId', protect, removeFromCart);

module.exports = router;
