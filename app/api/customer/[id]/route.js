import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const doc = await Customer.findById(id).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc, { status: 200 });
  } catch (err) {
    console.error("[GET /api/customer/[id]]", err);
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const res = await Customer.findByIdAndDelete(id).lean();
    if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[DELETE /api/customer/[id]]", err);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
