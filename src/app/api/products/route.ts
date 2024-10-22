// src/app/api/products/route.ts
import { NextResponse, NextRequest } from "next/server";
import { Product } from "@/models/Product";
import connectDB from "@/app/lib/db";
import { Log } from "@/models/Logs";
// import { errorHandler } from "@/app/middleware/errorHandler";

connectDB();

interface ProductRequestBody {
  name: string;
  quantity: number;
  category: string;
}

connectDB();

// GET handler with filter and pagination
export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const minQuantity = searchParams.get("minQuantity");
    const maxQuantity = searchParams.get("maxQuantity");
    const page = parseInt(searchParams.get("page") || "1"); // Default page = 1
    const limit = parseInt(searchParams.get("limit") || "10"); // Default limit = 10

    // Build query filter
    const filter: any = {};

    // Add category filter if provided
    if (category) {
      filter.category = category;
    }

    // Add quantity range filter if provided
    if (minQuantity || maxQuantity) {
      filter.quantity = {};
      if (minQuantity) filter.quantity.$gte = parseInt(minQuantity);
      if (maxQuantity) filter.quantity.$lte = parseInt(maxQuantity);
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Query products with filters, pagination, and limit
    const products = await Product.find(filter).skip(skip).limit(limit);

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);

    return NextResponse.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      totalProducts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  const reqBody: ProductRequestBody = await request.json();

  // Check for missing fields
  if (!reqBody || !reqBody.name || !reqBody.quantity || !reqBody.category) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const { name, quantity, category } = reqBody;

    // Check if the product already exists
    const products = await Product.find({ name });

    if (products.length > 0) {
      return NextResponse.json(
        { message: "The product is already there" },
        { status: 400 }
      );
    }

    const product = new Product({ name, quantity, category });
    await product.save();

    // Log the action if needed
    const logEntry = new Log({
      action: `Product ${name} added`,
      timestamp: new Date(),
    });
    await logEntry.save();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
