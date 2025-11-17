    const Order = require('../Models/order.model.js');
    const User = require('../Models/user.model.js');
    const Product = require('../Models/product.model.js');

    exports.createOrder = async (req, res) => {
        try {
            const {shippingAddress, paymentMethod} = req.body;

            if(!shippingAddress.phoneNumber){
                return res.status(400).json({ message: 'Phone number is required in shipping address' });
            }

            const user = await User.findById(req.user.id).populate({
                path: 'cart.product',
                model: 'Product',
            });

            if(!user|| user.cart.length === 0){
                return  res.status(400).json({ message: 'Cart is empty' });
            }
            let totalPrice = 0;
            const orderItems = [];

            for(const cartItem of user.cart){
                
                if (!cartItem.product) {
                    return res.status(404).json({ 
                        message: `A product in your cart was not found (it may have been deleted). Please clear your cart and try again.` 
                    });
                }
                
                const variant = cartItem.product.variants.find(v => v._id.toString() === cartItem.variantId);
                if(!variant){
                    return res.status(404).json({ message: `Variant ${cartItem.variantId} not found for product ${cartItem.product.name}` });
                }

                if(variant.stock < cartItem.quantity){
                    return res.status(400).json({ message: `Insufficient stock for variant ${variant.name}` });
                }
                orderItems.push({
                    name: `${cartItem.product.name} - ${variant.name}`,
                    quantity: cartItem.quantity,
                    price: variant.price,
                    product: cartItem.product._id,
                    variantId: cartItem.variantId,
                });
                totalPrice += variant.price * cartItem.quantity;
            }
            const order = new Order({
                user: req.user.id,
                orderItems,
                shippingAddress,
                paymentMethod,
                totalPrice,
            });

            const createdOrder = await order.save();
            
            user.cart = [];
            await user.save();

            console.log("========================================");
            console.log(`📲 SMS SERVICE: Sending text to ${shippingAddress.phoneNumber}...`);
            console.log(`💬 MESSAGE: "Success! Order #${createdOrder._id} confirmed. Total: $${totalPrice}"`);
            console.log("========================================");

            res.status(201).json(createdOrder);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Server error' });
        }
    };

    exports.getMyOrders = async (req, res) => {
        try {
            const orders = await Order.find({ user: req.user.id });
            res.json(orders);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Server error' });
        }
    };

    exports.getOrderById = async (req, res) => {
        try {
            const order = await Order.findById(req.params.id).populate('user', 'name email');
            if(order){
                if (req.user.isAdmin || order.user._id.toString()=== req.user.id){
                    res.json(order);
                } else {
                    res.status(401).json({ message: 'Not authorized to view this order' });
                }
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Server error' });
        }
    };

    // admin 

    exports.getAllOrders = async (req, res) => {
        try{
            const orders = await Order.find({}).populate('user', 'name email');
            res.json(orders);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Server error' });
        }
    };

    exports.updateOrderToPaid = async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
        
        if(order){
            order.isPaid = true;
            order.paidAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        }else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

    exports.updateOrderToDelivered = async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            if (order) {
                order.isDelivered = true;
                order.deliveredAt = Date.now();

                const updatedOrder = await order.save();
                res.json(updatedOrder);
            }else {
                res.status(404).json({ message: 'Order not found' });
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Server error' });
        }
    };

    exports.fakePayOrder = async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            if(!order) return res.status(404).json({ message: 'Order not found' });
            if (order.user.toString()!== req.user.id) return res.status(401).json({ message: 'Not authorized to pay for this order' });
            if(order.isPaid) return res.status(400).json({ message: 'Order is already paid' });

            order.isPaid= true;
            order.paidAt= Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Server error' });
        }
    };