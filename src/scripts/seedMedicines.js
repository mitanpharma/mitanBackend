import mongoose from "mongoose";
import { Medicine } from "../models/medicines.js";
import dotenv from "dotenv"; 
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mongodbConnection } from "../connection.js";

dotenv.config();
// Get current directory (needed for ES6 modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read JSON file
const medicinesData = JSON.parse(
  readFileSync(join(__dirname, "../medicines/medicinesData.json"), "utf-8")
);

const seedDatabase = async () => {
  try {
    // ✅ Connect to MongoDB using your connection function
    await mongodbConnection(process.env.MONGODB_URL);
    console.log("✅ Connected to MongoDB");

    // Insert all medicines from JSON
    const result = await Medicine.insertMany(medicinesData);
    console.log(`✅ Successfully imported ${result.length} medicines!`);

    // Display first 5 medicines as sample
    console.log("\n📋 Sample medicines imported:");
    result.slice(0, 5).forEach((medicine, index) => {
      console.log(
        `${index + 1}. ${medicine.PRODUCT} - ${medicine.MG_VALUE} (${
          medicine.MEDICINE_TYPE
        })`
      );
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log("\n🔒 Database connection closed");
    process.exit();
  }
};

// Run the seed function
seedDatabase();
