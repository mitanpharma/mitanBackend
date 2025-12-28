import { Medicine } from "../models/medicines.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllMedicines = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  // Get search and filter from query params
  const searchTerm = req.query.search || "";
  const type = req.query.type || "";

  // Build query object
  let query = {};

  if (searchTerm) {
    query.PRODUCT = { $regex: searchTerm, $options: "i" };
  }

  if (type && type !== "all") {
    query.MEDICINE_TYPE = { $regex: `^${type}$`, $options: "i" };
  }

 
  const medicines = await Medicine.find(query)
    .sort({ S_NO: 1 })
    .skip(skip)
    .limit(limit)
    .lean(); 

  const total = await Medicine.countDocuments(query);

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

//  Backend Route for Product Counts

export const getMedicineCounts = asyncHandler(async (req, res) => {
  const searchTerm = req.query.search || '';
  
  let baseQuery = {};
  if (searchTerm) {
    baseQuery.PRODUCT = { $regex: searchTerm, $options: 'i' };
  }

  const counts = await Promise.all([
    Medicine.countDocuments(baseQuery),
    Medicine.countDocuments({ ...baseQuery, MEDICINE_TYPE: /^tablet$/i }),
    Medicine.countDocuments({ ...baseQuery, MEDICINE_TYPE: /^capsule$/i }),
    Medicine.countDocuments({ ...baseQuery, MEDICINE_TYPE: /^syrup$/i }),
    Medicine.countDocuments({ ...baseQuery, MEDICINE_TYPE: /^injection$/i }),
    Medicine.countDocuments({ ...baseQuery, MEDICINE_TYPE: /^infusion$/i }),
  ]);

  res.json({
    success: true,
    counts: {
      all: counts[0],
      tablet: counts[1],
      capsule: counts[2],
      syrup: counts[3],
      injection: counts[4],
      infusion: counts[5],
    }
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
