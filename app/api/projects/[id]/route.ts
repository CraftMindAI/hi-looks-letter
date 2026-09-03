import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/requireAdmin";
import {
  MAX_IMAGES,
  fileToDataUri,
  validateImageFiles,
  validateTotalSize,
} from "@/lib/projectImages";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const db = getAdminDb();
  const docRef = db.collection("projects").doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const formData = await request.formData();
  const files = formData.getAll("images").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "At least one image is required." }, { status: 400 });
  }

  const existingImages: string[] = doc.data()?.images ?? [];
  if (existingImages.length + files.length > MAX_IMAGES) {
    return NextResponse.json(
      { error: `A project can have at most ${MAX_IMAGES} images.` },
      { status: 400 }
    );
  }
  const validationError = validateImageFiles(files);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const newImages = await Promise.all(files.map(fileToDataUri));

  const sizeError = validateTotalSize(existingImages, newImages);
  if (sizeError) {
    return NextResponse.json({ error: sizeError }, { status: 400 });
  }

  const images = [...existingImages, ...newImages];
  await docRef.update({ images });

  return NextResponse.json({ success: true, images });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const db = getAdminDb();
  const docRef = db.collection("projects").doc(id);

  const imageIndexParam = request.nextUrl.searchParams.get("imageIndex");

  if (imageIndexParam !== null) {
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const images: string[] = doc.data()?.images ?? [];
    const imageIndex = Number(imageIndexParam);
    if (!Number.isInteger(imageIndex) || imageIndex < 0 || imageIndex >= images.length) {
      return NextResponse.json({ error: "Invalid image index." }, { status: 400 });
    }

    const nextImages = images.filter((_, i) => i !== imageIndex);

    if (nextImages.length === 0) {
      await docRef.delete();
      return NextResponse.json({ success: true, deletedProject: true });
    }

    await docRef.update({ images: nextImages });
    return NextResponse.json({ success: true, images: nextImages });
  }

  const doc = await docRef.get();
  if (!doc.exists) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  await docRef.delete();
  return NextResponse.json({ success: true, deletedProject: true });
}
