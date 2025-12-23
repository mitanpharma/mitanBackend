import express from "express";
import {
  getAllMedicines,
  searchMedicines,
} from "../controllers/medicineController.js";
const router = express.Router();

// Get all medicines (with pagination)
router.get("/", getAllMedicines);

// Search medicines by name
router.get("/search", searchMedicines);

export default router;
