import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const toNum = (v, def = 0) =>
  v == null || v === "" ? def : Number.isFinite(+v) ? +v : def;

export async function GET() {
  try {
    await dbConnect();
    const rows = await Category.find()
      .sort({ order: 1, name: 1 })
      .lean();
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("[GET /api/category]", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const doc = {
      name: String(body.name ?? "").trim(),
      order: toNum(body.order, 0),
    };
    const created = await Category.create(doc);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[POST /api/category]", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id } = body || {};
    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return NextResponse.json({ error: "Invalid _id" }, { status: 400 });
    }

    const updates = {};
    if (body.name !== undefined) updates.name = String(body.name).trim();
    if (body.order !== undefined) updates.order = toNum(body.order, 0);

    const updated = await Category.findByIdAndUpdate(_id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("[PUT /api/category]", err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}
