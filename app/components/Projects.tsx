import { getAdminDb } from "@/lib/firebaseAdmin";

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

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) =>
            project.images.length > 0 ? (
              <div
                key={project.id}
                className="overflow-hidden rounded-xl border border-black/5 bg-white"
              >
                <div className="flex snap-x snap-mandatory overflow-x-auto bg-white">
                  {project.images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={src}
                      alt={`${project.name} ${i + 1}`}
                      className="h-40 w-full shrink-0 snap-center object-contain p-4"
                    />
                  ))}
                </div>
                <p className="truncate px-4 py-3 text-center text-sm font-semibold text-foreground/80">
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
