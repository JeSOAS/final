import Product from "@/models/Product";
import dbConnect from "@/lib/db";

export async function GET(_req, { params }) {
  await dbConnect();
  const id = params.id;                 // <-- was params._id (wrong)
  const product = await Product.findById(id).populate("category");
  return Response.json(product);
}

export async function DELETE(_req, { params }) {
  await dbConnect();
  const id = params.id;
  return Response.json(await Product.findByIdAndDelete(id));
}
