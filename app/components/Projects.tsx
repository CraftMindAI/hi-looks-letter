import { getDb } from "@/lib/mongodb";

const FALLBACK_PROJECTS = [
  "Anna University",
  "Khazana Jewellery",
  "Naidu Hall",
  "Ascendas",
  "Aasife Biriyani",
  "AVM Productions",
  "Spencer Plaza",
  "LIC",
  "MGM Beach Resorts",
  "Comcast",
  "Cognizant",
].map((name) => ({ id: name, name, images: [] as string[] }));

type ProjectItem = {
  id: string;
  name: string;
  images: string[];
};

async function getProjects(): Promise<ProjectItem[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection("projects")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    if (docs.length === 0) return FALLBACK_PROJECTS;

    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      images: doc.images ?? (doc.image ? [doc.image] : []),
    }));
  } catch {
    return FALLBACK_PROJECTS;
  }
}

export default async function Projects() {
  const projects = await getProjects();

  return (
    <section id="projects" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand">
            Our Projects
          </h2>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Trusted by Leading Brands
          </h3>
          <p className="mt-4 text-base leading-relaxed text-foreground/70">
            Proud to have delivered signage for institutions, retail chains,
            and businesses across Chennai and beyond.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {projects.map((project) =>
            project.images.length > 0 ? (
              <div
                key={project.id}
                className="relative overflow-hidden rounded-xl border border-black/5 bg-brand-tint/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.images[0]}
                  alt={project.name}
                  className="h-24 w-full object-cover"
                />
                {project.images.length > 1 && (
                  <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
                    +{project.images.length - 1}
                  </span>
                )}
                <p className="truncate px-3 py-2 text-center text-xs font-semibold text-foreground/80">
                  {project.name}
                </p>
              </div>
            ) : (
              <div
                key={project.id}
                className="flex h-24 items-center justify-center rounded-xl border border-black/5 bg-brand-tint/30 px-4 text-center text-sm font-semibold text-foreground/80 transition-colors hover:border-brand/30 hover:text-brand"
              >
                {project.name}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
