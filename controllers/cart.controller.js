const User = require('../Models/user.model');
const Product = require('../Models/product.model');

exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'cart.product',
            model: 'Product',
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.cart);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, variantId, quantity } = req.body;

        const user = await User.findById(req.user.id);
        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({ message: 'Product not found' });
        }

        const variant = product.variants.find(v => v._id.toString() === variantId);
        if(!variant){
            return res.status(404).json({ message: 'Variant not found' });
        }
        if(variant.stock < quantity){
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        const existingItem = user.cart.find(item => 
            item.product.toString() === productId && item.variantId.toString() === variantId
        );

        if(existingItem){
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, variantId, quantity });
        }

        await user.save();
        res.status(201).json(user.cart);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { variantId } = req.params;
        const user = await User.findById(req.user.id);

        user.cart = user.cart.filter(item => item.variantId !== variantId);

        await user.save();
        res.json(user.cart);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};