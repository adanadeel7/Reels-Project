import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import foodPartner from '../models/foodpartner.model.js';
import foodItem from '../models/fooditem.model.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/food-veiw';

async function seed() {
  try {
    console.log('Connecting to database:', DATABASE_URL);
    await mongoose.connect(DATABASE_URL);
    console.log('Connected successfully.');

    // Clear existing data (optional but clean for seeding)
    await foodPartner.deleteMany({});
    await foodItem.deleteMany({});
    console.log('Cleared existing foodPartners and foodItems.');

    // Create a mock Food Partner
    const hashedPassword = await bcrypt.hash('password123', 10);
    const chefAlfredo = await foodPartner.create({
      name: "Chef Alfredo's Bistro",
      email: 'chef@alfredo.com',
      password: hashedPassword,
      address: '123 Gourmet Street, Foodville',
      phone: '555-0199',
      contactName: 'Alfredo Mancini'
    });
    console.log('Created Chef Partner:', chefAlfredo.email);

    // Food Items sample data
    const sampleFoods = [
      {
        name: 'Artisanal Bread Tearing',
        video: 'https://videos.pexels.com/video-files/6420982/6420982-hd_1080_1920_25fps.mp4',
        description: 'Warm, crusty artisanal loaf being pulled apart, revealing a steaming, soft, and perfectly airy interior.',
        foodPartner: chefAlfredo._id,
        likeCount: 1540,
        savesCount: 420,
      },
      {
        name: 'Gourmet Cafe Dining',
        video: 'https://videos.pexels.com/video-files/34859864/34859864-hd_1080_1920_30fps.mp4',
        description: 'A relaxed dining experience featuring our signature chef-curated pasta and wine pairing inside a cozy, warmly lit cafe.',
        foodPartner: chefAlfredo._id,
        likeCount: 940,
        savesCount: 180,
      },
      {
        name: 'Steaming Hot Dumplings',
        video: 'https://www.youtube.com/shorts/v3J9U4Z8i1c',
        description: 'Freshly steamed dim sum dumplings filled with juicy, seasoned pork and aromatic spring onions, served with a spiced black vinegar dipping sauce.',
        foodPartner: chefAlfredo._id,
        likeCount: 3400,
        savesCount: 1540,
      },
      {
        name: 'Flame-Sautéed Fresh Veggies',
        video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        description: 'Crisp seasonal vegetables flame-sautéed in a hot wok with garlic, ginger, toasted sesame oil, and light soy sauce.',
        foodPartner: chefAlfredo._id,
        likeCount: 2150,
        savesCount: 940,
      }
    ];

    await foodItem.insertMany(sampleFoods);
    console.log('Successfully seeded 4 culinary food reels.');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
}

seed();
