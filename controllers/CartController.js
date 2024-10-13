import CartModel from "../models/CartModel.js";

class CartController {
    async updateCart(req, res) {
        const { user_id, item_id, quantity } = req.body;   
        try {
            const response = await CartModel.updateCartQuery(user_id, item_id, quantity);
            if (response) {
                if (response.message === 'OK' && response.data) {
                    return res.status(200).json({
                        message: 'Added to cart successfully',
                        success: true,
                        data: response.data,
                    });
                } else {
                    return res.status(500).json({
                        message: 'Failed to add to cart',
                        success: false,
                        error: response.error,
                    });
                }
            } else {
                return res.status(500).json({
                    message: 'Something went wrong. Please try again',
                });
            }
        } catch (error) {
            console.log('Error in addToCart:', error);
            return res.status(500).json({
                message: 'Internal server error',
            });
        }

    }

    async getCart(req, res) {
        const user_id = req.body.user_id;
        
        try {
            const response = await CartModel.getCartQuery(user_id);
            if (response) {
                if (response.message === 'OK' && response.data.length >= 0) {
                    return res.status(200).json({
                        message: 'Cart fetched successfully',
                        success: true,
                        data: response.data,
                    });
                } else {
                    return res.status(500).json({
                        message: 'Failed to fetch cart',
                        success: false,
                        error: response.error,
                    });
                }
            } else {
                return res.status(500).json({
                    message: 'Something went wrong. Please try again',
                });
            }
        } catch (error) {
            console.log('Error in getCart:', error);
            return res.status(500).json({
                message: 'Internal server error',
            });
            
        }
    }

    async removeFromCart(req, res) {
        const { user_id, cart_id } = req.body;
        try {
            const response = await CartModel.removeFromCartQuery(cart_id, user_id);
            if (response) {
                if (response.message === 'OK') {
                    return res.status(200).json({
                        message: 'Removed from cart successfully',
                        success: true,
                    });
                } else {
                    return res.status(500).json({
                        message: 'Failed to remove from cart',
                        success: false,
                        error: response.error,
                    });
                }
            } else {
                return res.status(500).json({
                    message: 'Something went wrong. Please try again',
                });
            }
        } catch (error) {
            console.log('Error in removeFromCart:', error);
            return res.status(500).json({
                message: 'Internal server error',
            });
        }
    }
}

export default new CartController();