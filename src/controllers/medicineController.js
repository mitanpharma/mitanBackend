import { Medicine } from "../models/medicines.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get all medicines with pagination
export const getAllMedicines = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const medicines = await Medicine.find()
    .sort({ S_NO: 1 }) // Sort by serial number
    .skip(skip)
    .limit(limit);

  const total = await Medicine.countDocuments();

  res.status(200).json({
    success: true,
    data: medicines,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  });
});

// Search medicines by product name
export const searchMedicines = asyncHandler(async (req, res) => {
  const { q } = req.query; // search query

  if (!q || q.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  try {
    // Search across multiple fields for better results
    const searchQuery = {
      $or: [
        { PRODUCT: { $regex: q, $options: "i" } }, // Case-insensitive search in product name
        { MG_VALUE: { $regex: q, $options: "i" } }, // Also search in strength
        { MEDICINE_TYPE: { $regex: q, $options: "i" } }, // Also search in type
      ],
    };

    // Remove the .limit(20) to get ALL matching results
    // Or increase it to a much higher number if you want some limit
    const medicines = await Medicine.find(searchQuery)
      .sort({ S_NO: 1 }) // Sort by serial number
      .limit(1000); // Increased limit to 1000 (or remove completely for unlimited)

    res.status(200).json({
      success: true,
      data: medicines,
      count: medicines.length,
      message: `Found ${medicines.length} matching products`,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching medicines",
      error: error.message,
    });
  }
});