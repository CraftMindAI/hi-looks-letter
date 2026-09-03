import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/requireAdmin";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 10;

export async function GET() {
  const db = await getDb();
  const docs = await db
    .collection("projects")
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(
    docs.map((doc) => ({
      _id: doc._id.toString(),
      name: doc.name,
      images: doc.images ?? (doc.image ? [doc.image] : []),
    }))
  );
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return auth.error;

  const formData = await request.formData();
  const files = formData.getAll("images").filter((f): f is File => f instanceof File);
  const name = (formData.get("name") as string | null)?.trim();

  if (!name) {
    return NextResponse.json({ error: "Project name is required." }, { status: 400 });
  }
  if (files.length === 0) {
    return NextResponse.json({ error: "At least one image is required." }, { status: 400 });
  }
  if (files.length > MAX_IMAGES) {
    return NextResponse.json({ error: `You can upload at most ${MAX_IMAGES} images at once.` }, { status: 400 });
  }
  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "All files must be images." }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Each image must be smaller than 5MB." }, { status: 400 });
    }
  }

  const images = await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      return `data:${file.type};base64,${buffer.toString("base64")}`;
    })
  );

  const db = await getDb();
  const result = await db.collection("projects").insertOne({
    name,
    images,
    createdAt: new Date(),
  });

  return NextResponse.json(
    { _id: result.insertedId.toString(), name, images },
    { status: 201 }
  );
}
