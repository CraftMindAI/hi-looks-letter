import { getAdminDb } from "@/lib/firebaseAdmin";
import ProjectGallery from "@/app/components/ProjectGallery";

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
    const db = getAdminDb();
    const snapshot = await db.collection("projects").orderBy("createdAt", "desc").get();

    if (snapshot.empty) return FALLBACK_PROJECTS;

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      images: doc.data().images ?? [],
    }));
  } catch {
    return FALLBACK_PROJECTS;
  }
}

export default async function Projects() {
  const projects = await getProjects();

  const images = projects.flatMap((project) =>
    project.images.map((src, i) => ({
      key: `${project.id}-${i}`,
      src,
      alt: `${project.name} ${i + 1}`,
    }))
  );

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

        {images.length > 0 ? (
          <ProjectGallery images={images} />
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex h-24 items-center justify-center rounded-xl border border-black/5 bg-brand-tint/30 px-4 text-center text-sm font-semibold text-foreground/80 transition-colors hover:border-brand/30 hover:text-brand"
              >
                {project.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
