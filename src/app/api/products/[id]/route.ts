// src/app/api/products/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { Product } from "@/models/Product";
import connectDB from "@/app/lib/db";
import { Log } from "@/models/Logs";

connectDB();

// GET handler
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context; 
  const { id } = params; 

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

// PUT handler
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context; 
  const { id } = params; 

  try {
    const body = await req.json();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Validate quantity
    if (body.quantity < 0) {
      return NextResponse.json(
        { message: "Quantity must be 0 or more" },
        { status: 400 }
      );
    }

    // Update product
    product.quantity = body.quantity;
    await product.save();
    // Log the action if needed
    const logEntry = new Log({
      action: `Product ${name} is updated`,
      timestamp: new Date(),
    });
    await logEntry.save();
    
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  const { id } = params; 

  try {
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Check if the product can be deleted (i.e., quantity must be 0)
    if (product.quantity > 0) {
      return NextResponse.json(
        { message: "Cannot delete product with quantity greater than 0" },
        { status: 400 }
      );
    }

    // Delete the product
    await Product.findByIdAndDelete(id);

    // Log the action 
    const logEntry = new Log({
      action: `Product ${name} is deleted`,
      timestamp: new Date(),
    });

    await logEntry.save();
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
