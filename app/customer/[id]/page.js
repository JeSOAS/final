import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomerDetail({ params }) {
  await dbConnect();
  const doc = await Customer.findById(params.id).lean();
  if (!doc) return notFound();

  const dobText = doc.dob ? new Date(doc.dob).toLocaleDateString() : "-";

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-2">
      <h1 className="text-2xl font-semibold mb-2">Customer Detail</h1>
      <p><span className="font-semibold">Name:</span> {doc.name}</p>
      <p><span className="font-semibold">Date of Birth:</span> {dobText}</p>
      <p><span className="font-semibold">Member #:</span> {doc.memberNumber}</p>
      <p><span className="font-semibold">Interests:</span> {doc.interests || "-"}</p>
    </div>
  );
}
