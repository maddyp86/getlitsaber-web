interface ContentsItem {
  number: string;
  title: string;
}

interface PolicyContentsProps {
  sections: ContentsItem[];
}

export default function PolicyContents({ sections }: PolicyContentsProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-label text-eyebrow text-text-muted tracking-widest uppercase mb-1">
        -- CONTENTS
      </p>
      <div className="border border-border-default rounded-sm p-5">
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-y-3 gap-x-8">
          {sections.map((s) => (
            <li key={s.number}>
              <a
                href={`#section-${s.number}`}
                className="font-label text-body-sm text-accent-cyan underline-offset-2 hover:underline transition-colors duration-150"
              >
                {s.number} {s.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
