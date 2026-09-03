"use client";

import { FormEvent, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

type Project = {
  _id: string;
  name: string;
  images: string[];
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [addingToId, setAddingToId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }
    setPreviews(Array.from(files).map((file) => URL.createObjectURL(file)));
  };

  const authHeader = async () => {
    const idToken = await auth.currentUser?.getIdToken();
    return idToken ? { Authorization: `Bearer ${idToken}` } : undefined;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const fileInput = form.elements.namedItem("images") as HTMLInputElement;
    const files = fileInput.files;

    if (!nameInput.value.trim() || !files || files.length === 0) {
      setError("Please provide a project name and at least one image.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", nameInput.value.trim());
      Array.from(files).forEach((file) => formData.append("images", file));

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: await authHeader(),
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed.");
      }

      form.reset();
      setPreviews([]);
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setError(null);
    setDeletingKey(id);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: await authHeader(),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Delete failed.");
      }

      setProjects((prev) => prev.filter((project) => project._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingKey(null);
    }
  };

  const handleAddImages = async (id: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setAddingToId(id);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("images", file));

      const res = await fetch(`/api/projects/${id}`, {
        method: "POST",
        headers: await authHeader(),
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      setProjects((prev) =>
        prev.map((project) =>
          project._id === id ? { ...project, images: data.images } : project
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setAddingToId(null);
    }
  };

  const handleDeleteImage = async (id: string, imageIndex: number) => {
    setError(null);
    const key = `${id}:${imageIndex}`;
    setDeletingKey(key);
    try {
      const res = await fetch(`/api/projects/${id}?imageIndex=${imageIndex}`, {
        method: "DELETE",
        headers: await authHeader(),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Delete failed.");
      }

      if (data.deletedProject) {
        setProjects((prev) => prev.filter((project) => project._id !== id));
      } else {
        setProjects((prev) =>
          prev.map((project) =>
            project._id === id ? { ...project, images: data.images } : project
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingKey(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-foreground">Our Projects</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Upload one or more photos per project to feature them on the
        homepage, or remove ones you no longer want shown.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-6 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor="name" className="text-sm font-medium text-foreground/80">
            Project Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. Khazana Jewellery"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="images" className="text-sm font-medium text-foreground/80">
            Images (you can select multiple)
          </label>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            required
            onChange={handleFileChange}
            className="mt-1 w-full text-sm text-foreground/70 file:mr-3 file:rounded-full file:border-0 file:bg-brand-tint file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand"
          />
        </div>

        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {previews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt="Preview"
                className="h-16 w-16 rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-70"
        >
          {submitting ? "Uploading..." : "Upload"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
      )}

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-foreground/60">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-foreground/60">
            No uploaded projects yet. Add one above.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="rounded-xl border border-black/5 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {project.name}{" "}
                    <span className="text-foreground/50">
                      ({project.images.length} image
                      {project.images.length === 1 ? "" : "s"})
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer rounded-full border border-brand/30 px-3 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand-tint">
                      {addingToId === project._id ? "Uploading..." : "+ Add Images"}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        disabled={addingToId === project._id}
                        onChange={(e) => {
                          handleAddImages(project._id, e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(project._id)}
                      disabled={deletingKey === project._id}
                      className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                    >
                      {deletingKey === project._id ? "Deleting..." : "Delete Project"}
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {project.images.map((src, i) => {
                    const key = `${project._id}:${i}`;
                    return (
                      <div
                        key={key}
                        className="group relative overflow-hidden rounded-lg border border-black/5"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`${project.name} ${i + 1}`}
                          className="h-24 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(project._id, i)}
                          disabled={deletingKey === key}
                          className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity hover:bg-red-600 disabled:opacity-100 group-hover:opacity-100"
                        >
                          {deletingKey === key ? "..." : "Delete"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
