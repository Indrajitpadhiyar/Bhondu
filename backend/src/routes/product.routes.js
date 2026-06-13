import { Router } from 'express';
import * as ProductController from '../controllers/product.controller.js';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware.js';
import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import BlankTemplate from '../models/blank-template.model.js';
import PrintArea from '../models/print-area.model.js';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/seed', ProductController.seedProducts);
router.get('/create-plain-tshirt', async (req, res, next) => {
  try {
    const name = "Bhondu Plain Custom T-Shirt";
    let product = await Product.findOne({ name });
    if (!product) {
      product = await Product.create({
        name,
        price: 299,
        salePrice: 249,
        discount: 16,
        description: "Completely plain premium quality customizable t-shirt. Select your fabric color and add custom prints, labels, and designs.",
        category: "T-Shirts",
        subcategory: "Plain Custom T-Shirts",
        gender: "unisex",
        stock: 100,
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ffc0cb", "#800080", "#808080"],
        images: [
          "https://res.cloudinary.com/dvgxs3u4h/image/upload/v1781240640/bhondu/products/wqztoa1qldreyaoaf8ow.png"
        ],
        rating: 5.0,
        reviewsCount: 0
      });
    }

    let template = await BlankTemplate.findOne({ productId: product._id });
    if (!template) {
      template = await BlankTemplate.create({
        productId: product._id,
        name: `${product.name} Customizer Template`,
        views: [
          { viewId: 'front', mockupImageUrl: product.images[0], width: 600, height: 600 },
          { viewId: 'back', mockupImageUrl: product.images[0], width: 600, height: 600 },
          { viewId: 'left-sleeve', mockupImageUrl: product.images[0], width: 600, height: 600 },
          { viewId: 'right-sleeve', mockupImageUrl: product.images[0], width: 600, height: 600 },
          { viewId: 'collar', mockupImageUrl: product.images[0], width: 600, height: 600 }
        ],
        isActive: true
      });

      const printAreas = [
        { templateId: template._id, viewId: 'front', x: 185, y: 110, width: 230, height: 380, safeMargin: 10, unit: 'px' },
        { templateId: template._id, viewId: 'back', x: 185, y: 80, width: 230, height: 400, safeMargin: 10, unit: 'px' },
        { templateId: template._id, viewId: 'left-sleeve', x: 200, y: 200, width: 200, height: 200, safeMargin: 5, unit: 'px' },
        { templateId: template._id, viewId: 'right-sleeve', x: 200, y: 200, width: 200, height: 200, safeMargin: 5, unit: 'px' },
        { templateId: template._id, viewId: 'collar', x: 200, y: 150, width: 200, height: 100, safeMargin: 5, unit: 'px' }
      ];

      await PrintArea.insertMany(printAreas);
    }

    res.status(200).json({
      status: 'success',
      message: 'Plain T-shirt product and template are ready!',
      product
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

router.get('/:id', ProductController.getProductDetails);

// Admin-only endpoints
router.post('/', authenticateUser, authorizeRoles('Admin', 'Super Admin'), ProductController.createProduct);
router.patch('/:id', authenticateUser, authorizeRoles('Admin', 'Super Admin'), ProductController.updateProduct);
router.delete('/:id', authenticateUser, authorizeRoles('Admin', 'Super Admin'), ProductController.deleteProduct);

// Review endpoints
router.get('/:id/reviews', ProductController.getProductReviews);
router.post('/:id/reviews', authenticateUser, ProductController.createReview);
router.delete('/:id/reviews/:reviewId', authenticateUser, ProductController.deleteReview);

export default router;

