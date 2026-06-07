import { EYEBROW, HEADLINE, SUBCOPY, EDITIONS } from "./editions.content";
import EditionCard from "./EditionCard";

export default function EditionsSection() {
  return (
    <section id="editions">
      {/* Header */}
      <div className="text-center mb-10 lg:mb-14">
        <p className="font-label text-eyebrow text-text-accent tracking-widest mb-3">
          {EYEBROW}
        </p>
        <h2
          className="font-display font-bold text-white uppercase text-center mb-4"
          style={{
            textShadow: "0 0 50px rgba(0, 229, 255, 0.75)",
            lineHeight: "normal",
            fontSize: "clamp(45px, 5vw, 75px)",
          }}
        >
          {HEADLINE}
        </h2>
        <p className="font-body text-body-sm lg:text-body text-text-secondary max-w-lg mx-auto">
          {SUBCOPY}
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-[50px]">
        {EDITIONS.map((edition) => (
          <EditionCard key={edition.id} {...edition} />
        ))}
      </div>
    </section>
  );
}