import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Product from '../models/product.model.js';
import BlankTemplate from '../models/blank-template.model.js';
import PrintArea from '../models/print-area.model.js';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (dnsError) {
  console.warn('Failed to set custom DNS servers:', dnsError.message);
}

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://bmunnambbs_db_user:SsF1CzOKyHeL8Cr4@bhondu.uq7dsr0.mongodb.net/";

const seed = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // Fetch all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products.`);

    for (const product of products) {
      // Check if template already exists
      const existing = await BlankTemplate.findOne({ productId: product._id });
      if (existing) {
        console.log(`Template already exists for product: ${product.name}. Skipping.`);
        continue;
      }

      console.log(`Seeding template for product: ${product.name}...`);
      
      const mockupImageUrl = product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600';
      const backMockupUrl = product.images[1] || mockupImageUrl;

      const template = await BlankTemplate.create({
        productId: product._id,
        name: `${product.name} Customizer Template`,
        views: [
          { viewId: 'front', mockupImageUrl, width: 600, height: 600 },
          { viewId: 'back', mockupImageUrl: backMockupUrl, width: 600, height: 600 },
          { viewId: 'left-sleeve', mockupImageUrl, width: 600, height: 600 },
          { viewId: 'right-sleeve', mockupImageUrl, width: 600, height: 600 },
          { viewId: 'collar', mockupImageUrl, width: 600, height: 600 }
        ],
        isActive: true
      });

      const printAreas = [
        // Front Chest
        { templateId: template._id, viewId: 'front', x: 185, y: 110, width: 230, height: 380, safeMargin: 10, unit: 'px' },
        // Back Name & Number
        { templateId: template._id, viewId: 'back', x: 185, y: 80, width: 230, height: 400, safeMargin: 10, unit: 'px' },
        // Left Sleeve
        { templateId: template._id, viewId: 'left-sleeve', x: 200, y: 200, width: 200, height: 200, safeMargin: 5, unit: 'px' },
        // Right Sleeve
        { templateId: template._id, viewId: 'right-sleeve', x: 200, y: 200, width: 200, height: 200, safeMargin: 5, unit: 'px' },
        // Collar
        { templateId: template._id, viewId: 'collar', x: 200, y: 150, width: 200, height: 100, safeMargin: 5, unit: 'px' }
      ];

      await PrintArea.insertMany(printAreas);
      console.log(`Successfully seeded templates and print areas for: ${product.name}`);
    }

    console.log('Seeding finished!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();
