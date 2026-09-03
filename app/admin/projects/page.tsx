"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { auth } from "@/lib/firebase";

type Project = {
  _id: string;
  name: string;
  images: string[];
};

type PendingFile = {
  file: File;
  preview: string;
  tooLarge: boolean;
};

const MAX_IMAGE_SIZE_KB = 500;

function formatKb(bytes: number) {
  return `${Math.round(bytes / 1024)}KB`;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [confirmingKey, setConfirmingKey] = useState<string | null>(null);
  const [addingToId, setAddingToId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  const authHeader = async () => {
    const idToken = await auth.currentUser?.getIdToken();
    return idToken ? { Authorization: `Bearer ${idToken}` } : undefined;
  };

  const addFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    const next: PendingFile[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      tooLarge: file.size > MAX_IMAGE_SIZE_KB * 1024,
    }));
    setPendingFiles((prev) => [...prev, ...next]);
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const clearPendingFiles = () => {
    pendingFiles.forEach((p) => URL.revokeObjectURL(p.preview));
    setPendingFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasOversizedFile = pendingFiles.some((p) => p.tooLarge);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!nameValue.trim() || pendingFiles.length === 0) {
      setError("Please provide a project name and at least one image.");
      return;
    }
    if (hasOversizedFile) {
      setError(`Remove images larger than ${MAX_IMAGE_SIZE_KB}KB before uploading.`);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", nameValue.trim());
      pendingFiles.forEach((p) => formData.append("images", p.file));

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: await authHeader(),
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed.");
      }

      setNameValue("");
      clearPendingFiles();
      setNotice("Project uploaded.");
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setError(null);
    setConfirmingKey(null);
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
      setNotice("Project deleted.");
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
      setNotice("Images added.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setAddingToId(null);
    }
  };

  const handleDeleteImage = async (id: string, imageIndex: number) => {
    setError(null);
    const key = `${id}:${imageIndex}`;
    setConfirmingKey(null);
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
      setNotice("Image deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingKey(null);
    }
  };

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        project.name.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [projects, search]
  );

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Our Projects</h1>
          <p className="mt-2 text-sm text-foreground/60">
            Upload one or more photos per project to feature them on the
            homepage, or remove ones you no longer want shown.
          </p>
        </div>
        {notice && (
          <span className="rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
            {notice}
          </span>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-black/5 bg-white p-6"
      >
        <div>
          <label htmlFor="name" className="text-sm font-medium text-foreground/80">
            Project Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            placeholder="e.g. Khazana Jewellery"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand sm:max-w-sm"
          />
        </div>

        <label
          htmlFor="images"
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
          }}
          className={`mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
            dragActive ? "border-brand bg-brand-tint/40" : "border-black/10 hover:border-brand/40"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-8 w-8 text-brand"
          >
            <path d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
          </svg>
          <p className="text-sm font-semibold text-foreground">
            Click to browse or drag images here
          </p>
          <p className="text-xs text-foreground/50">
            Each image under {MAX_IMAGE_SIZE_KB}KB &middot; multiple images allowed
          </p>
          <input
            ref={fileInputRef}
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>

        {pendingFiles.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3 border-t border-black/5 pt-4">
            {pendingFiles.map((p, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.preview}
                  alt="Preview"
                  className={`h-20 w-20 rounded-lg object-cover ${
                    p.tooLarge ? "ring-2 ring-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => removePendingFile(i)}
                  aria-label="Remove image"
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs font-bold text-white hover:bg-red-600"
                >
                  &times;
                </button>
                <p
                  className={`mt-1 text-center text-[10px] font-medium ${
                    p.tooLarge ? "text-red-600" : "text-foreground/50"
                  }`}
                >
                  {formatKb(p.file.size)}
                </p>
              </div>
            ))}
          </div>
        )}

        {hasOversizedFile && (
          <p className="mt-3 text-xs font-medium text-red-600">
            One or more images exceed {MAX_IMAGE_SIZE_KB}KB — remove or compress them before uploading.
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting || pendingFiles.length === 0}
            className="flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {submitting && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {submitting ? "Uploading..." : "Upload"}
          </button>
          {pendingFiles.length > 0 && (
            <button
              type="button"
              onClick={clearPendingFiles}
              className="text-sm font-medium text-foreground/50 hover:text-foreground"
            >
              Clear selection
            </button>
          )}
        </div>
      </form>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">
            {loading ? "Projects" : `${filteredProjects.length} of ${projects.length} Projects`}
          </h2>
          {projects.length > 0 && (
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-48 rounded-full border border-black/10 px-4 py-1.5 text-sm outline-none focus:border-brand"
            />
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-xl border border-black/5 bg-white"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-black/10 py-16 text-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-10 w-10 text-foreground/30"
            >
              <path d="M4 4h16v16H4z M4 9h16 M9 9v11" />
            </svg>
            <p className="text-sm font-medium text-foreground/60">
              No uploaded projects yet.
            </p>
            <p className="text-xs text-foreground/40">Add one using the form above.</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <p className="text-sm text-foreground/60">
            No projects match &ldquo;{search}&rdquo;.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="rounded-xl border border-black/5 bg-white p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-3">
                  <p className="text-sm font-semibold text-foreground">
                    {project.name}{" "}
                    <span className="font-normal text-foreground/50">
                      &middot; {project.images.length} image
                      {project.images.length === 1 ? "" : "s"}
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
                    {confirmingKey === project._id ? (
                      <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-1">
                        <span className="text-xs font-medium text-red-700">Delete project?</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project._id)}
                          className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingKey(null)}
                          className="rounded-full px-2 py-0.5 text-xs font-semibold text-foreground/60 hover:bg-black/5"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmingKey(project._id)}
                        disabled={deletingKey === project._id}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                      >
                        {deletingKey === project._id ? "Deleting..." : "Delete Project"}
                      </button>
                    )}
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
                        {confirmingKey === key ? (
                          <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/70">
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(project._id, i)}
                              className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmingKey(null)}
                              className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmingKey(key)}
                            disabled={deletingKey === key}
                            className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity hover:bg-red-600 disabled:opacity-100 group-hover:opacity-100"
                          >
                            {deletingKey === key ? "..." : "Delete"}
                          </button>
                        )}
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
