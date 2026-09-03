import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/requireAdmin";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 10;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid project id." }, { status: 400 });
  }

  const db = await getDb();
  const collection = db.collection("projects");
  const doc = await collection.findOne({ _id: new ObjectId(id) });

  if (!doc) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const formData = await request.formData();
  const files = formData.getAll("images").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "At least one image is required." }, { status: 400 });
  }

  const existingImages: string[] = doc.images ?? (doc.image ? [doc.image] : []);
  if (existingImages.length + files.length > MAX_IMAGES) {
    return NextResponse.json(
      { error: `A project can have at most ${MAX_IMAGES} images.` },
      { status: 400 }
    );
  }
  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "All files must be images." }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Each image must be smaller than 5MB." }, { status: 400 });
    }
  }

  const newImages = await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      return `data:${file.type};base64,${buffer.toString("base64")}`;
    })
  );

  const images = [...existingImages, ...newImages];
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { images }, $unset: { image: "" } }
  );

  return NextResponse.json({ success: true, images });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return auth.error;

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid project id." }, { status: 400 });
  }

  const imageIndexParam = request.nextUrl.searchParams.get("imageIndex");
  const db = await getDb();
  const collection = db.collection("projects");

  if (imageIndexParam !== null) {
    const imageIndex = Number(imageIndexParam);
    const doc = await collection.findOne({ _id: new ObjectId(id) });

    if (!doc) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const images: string[] = doc.images ?? (doc.image ? [doc.image] : []);
    if (!Number.isInteger(imageIndex) || imageIndex < 0 || imageIndex >= images.length) {
      return NextResponse.json({ error: "Invalid image index." }, { status: 400 });
    }

    const nextImages = images.filter((_, i) => i !== imageIndex);

    if (nextImages.length === 0) {
      await collection.deleteOne({ _id: new ObjectId(id) });
      return NextResponse.json({ success: true, deletedProject: true });
    }

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { images: nextImages }, $unset: { image: "" } }
    );
    return NextResponse.json({ success: true, images: nextImages });
  }

  const result = await collection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, deletedProject: true });
}
