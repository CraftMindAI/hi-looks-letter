import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/requireAdmin";
import { MAX_IMAGES, fileToDataUri, validateImageFiles, validateTotalSize } from "@/lib/projectImages";

export async function GET() {
  const db = getAdminDb();
  const snapshot = await db.collection("projects").orderBy("createdAt", "desc").get();

  return NextResponse.json(
    snapshot.docs.map((doc) => ({
      _id: doc.id,
      name: doc.data().name,
      images: doc.data().images ?? [],
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
  const validationError = validateImageFiles(files);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const images = await Promise.all(files.map(fileToDataUri));

  const sizeError = validateTotalSize([], images);
  if (sizeError) {
    return NextResponse.json({ error: sizeError }, { status: 400 });
  }

  const db = getAdminDb();
  const docRef = await db.collection("projects").add({
    name,
    images,
    createdAt: new Date(),
  });

  return NextResponse.json({ _id: docRef.id, name, images }, { status: 201 });
}
