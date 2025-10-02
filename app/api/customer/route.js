import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const toNum = (v, def = 0) => (v == null || v === "" ? def : Number(v));
const toDate = (v) => (v ? new Date(v) : null);

export async function GET() {
  try {
    await dbConnect();
    const rows = await Customer.find().sort({ memberNumber: 1, name: 1 }).lean();
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("[GET /api/customer]", err);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const doc = {
      name: String(body.name ?? "").trim(),
      dob: toDate(body.dob),
      memberNumber: toNum(body.memberNumber, 0),
      interests: String(body.interests ?? "").trim(),
    };
    const created = await Customer.create(doc);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[POST /api/customer]", err);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
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
    if (body.dob !== undefined) updates.dob = toDate(body.dob);
    if (body.memberNumber !== undefined) updates.memberNumber = toNum(body.memberNumber);
    if (body.interests !== undefined) updates.interests = String(body.interests).trim();

    const updated = await Customer.findByIdAndUpdate(_id, updates, { new: true, runValidators: true }).lean();
    if (!updated) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("[PUT /api/customer]", err);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}
