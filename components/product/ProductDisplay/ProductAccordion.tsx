"use client";

import { useState } from "react";
import { ACCORDION_ITEMS } from "./accordion.content";
import type { AccordionBody, AccordionBullet, AccordionSpecGroup, AccordionProseBlock } from "./accordion.content";

function BulletsBody({ items }: { items: AccordionBullet[] }) {
  return (
    <ul className="list-disc pl-[16px] flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={i} className="font-body text-[16px] text-white leading-relaxed">
          <span className="font-bold">{item.lead}</span>{" "}
          <span className="font-normal">{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

function SpecsBody({ groups }: { groups: AccordionSpecGroup[] }) {
  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="font-body font-bold text-[16px] text-white uppercase mb-2">
            {group.label}
          </p>
          <ul className="list-disc pl-[16px] flex flex-col gap-1">
            {group.bullets.map((b, i) => (
              <li key={i} className="font-body font-normal text-[16px] text-white leading-relaxed">
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ProseBody({ blocks }: { blocks: AccordionProseBlock[] }) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, i) => (
        <div key={i}>
          {block.lead && !block.bullets && (
            <p className="font-body text-[16px] text-white leading-relaxed">
              <span className="font-bold">{block.lead}</span>
              {block.text && (
                <>
                  {" "}
                  <span
                    className="font-normal"
                    dangerouslySetInnerHTML={{ __html: block.text }}
                  />
                </>
              )}
            </p>
          )}
          {!block.lead && block.text && (
            <p
              className="font-body font-normal text-[16px] text-white leading-relaxed"
              dangerouslySetInnerHTML={{ __html: block.text }}
            />
          )}
          {block.bullets && (
            <>
              {block.lead && (
                <p className="font-body font-bold text-[16px] text-white mb-2">
                  {block.lead}
                </p>
              )}
              <ul className="list-disc pl-[16px] flex flex-col gap-1">
                {block.bullets.map((b, j) => (
                  <li key={j} className="font-body font-normal text-[20px] text-white leading-relaxed">
                    {b}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function PanelBody({ body }: { body: AccordionBody }) {
  if (body.type === "bullets") return <BulletsBody items={body.items} />;
  if (body.type === "specs") return <SpecsBody groups={body.groups} />;
  return <ProseBody blocks={body.blocks} />;
}

export default function ProductAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="w-full">
      {ACCORDION_ITEMS.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `accordion-panel-${item.id}`;
        const headerId = `accordion-header-${item.id}`;

        return (
          <div key={item.id}>
            <button
              id={headerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between py-[20px] border-t border-[#383838] text-left cursor-pointer"
            >
              <span className="font-body font-semibold text-[20px] text-white leading-tight">
                {item.title}
              </span>
              <span className="flex-shrink-0 ml-4 text-white" aria-hidden="true">
                {isOpen ? (
                  <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="2" y1="12.5" x2="23" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12.5" y1="2" x2="12.5" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <line x1="2" y1="12.5" x2="23" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className="pb-[30px]"
            >
              <PanelBody body={item.body} />
            </div>
          </div>
        );
      })}
      {/* Bottom border to close the last panel */}
      <div className="border-t border-[#383838]" />
    </div>
  );
}
