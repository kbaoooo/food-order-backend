import express from 'express';
import multer from 'multer';
import MenuController from '../controllers/MenuController.js';

const menuRouter = express.Router();

// image upload
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Routes for menu
// Add a item new menu
menuRouter.post('/add-food', upload.single('image') , MenuController.addFoodToMenu);

// Get the menu
menuRouter.post('/get-menu', MenuController.getMenu);

// Get food
menuRouter.get('/get-food/:item_id', MenuController.getFood);

// Remove a item from menu
menuRouter.post('/remove-food', MenuController.removeFood);

menuRouter.post("/favour", MenuController.toggleFavour)

export default menuRouter;