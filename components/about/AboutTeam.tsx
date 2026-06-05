"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  TEAM_EYEBROW,
  TEAM_HEADLINE,
  TEAM_INTRO,
  TEAM_MEMBERS,
  type TeamMember,
} from "./about.content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function RoleTags({ roles, accent }: { roles: string[]; accent: string }) {
  return (
    <>
      {/* Desktop: single inline string, member-colored */}
      <p
        className="hidden lg:block font-label text-[14px] tracking-[0.05em] uppercase"
        style={{ color: accent }}
      >
        {roles.join(" · ")}
      </p>
      {/* Mobile: pill chips */}
      <div className="flex lg:hidden flex-wrap gap-2 mt-1">
        {roles.map((role) => (
          <span
            key={role}
            className="px-2.5 py-1 rounded-pill font-label text-[10px] tracking-[0.12em] uppercase"
            style={{
              color: accent,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: `${accent}40`,
              backgroundColor: "#110826",
            }}
          >
            {role}
          </span>
        ))}
      </div>
    </>
  );
}

function BioCard({
  member,
  index,
  accent,
}: {
  member: TeamMember;
  index: number;
  accent: string;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className="flex w-full lg:w-[475px] flex-col"
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
    >
      {/* Top accent line (475px × 2px, member-colored gradient) */}
      <div
        className="h-[2px] w-full shrink-0"
        style={{
          background: `linear-gradient(90deg, #150C2D 0%, ${accent} 49.04%, #150C2D 97.6%)`,
        }}
      />

      {/* Card */}
      <div className="flex flex-1 flex-col items-start gap-[18px] rounded-[10px] border border-[rgba(75,47,129,0.50)] bg-[#150C2D] p-5">
        {/* Square headshot, stretched to card content width */}
        <div className="relative w-full aspect-square h-[clamp(260px,32vw,360px)] self-stretch overflow-hidden bg-surface-card">
          <Image
            src={member.imageSrc}
            alt={member.imageAlt}
            fill
            sizes="(min-width: 1024px) 435px, 90vw"
            className="object-cover object-top"
          />
        </div>

        <div className="flex flex-col gap-3">
          <h3
            className="font-subhead font-bold text-white leading-normal"
            style={{ fontSize: "clamp(26px, 3vw, 35px)" }}
          >
            {member.name}
          </h3>
          <RoleTags roles={member.roles} accent={accent} />
        </div>

        <p className="font-body text-body-sm text-text-secondary leading-relaxed">
          {member.bio}
        </p>
      </div>
    </motion.div>
  );
}

export default function AboutTeam() {
  const prefersReduced = useReducedMotion();
  return (
    <section className="relative w-full bg-[#080516]" aria-label="The team">
      <div className="mx-auto w-full max-w-[1250px] px-[20px] lg:px-[60px] py-[100px]">
        <motion.p
          className="font-label text-eyebrow tracking-[0.2em] uppercase text-accent-magenta mb-4"
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {TEAM_EYEBROW}
        </motion.p>
        <motion.h2
          className="font-display font-bold leading-[1.1] text-white mb-6"
          style={{ fontSize: "clamp(45px, 5vw, 75px)" }}
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.05, ease: EASE }}
        >
          {TEAM_HEADLINE}
        </motion.h2>
        <motion.p
          className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed mb-14"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          {TEAM_INTRO}
        </motion.p>

        {/* Outer: flex, centered, 50px gap, equal-height cards */}
        <div className="flex flex-col items-stretch gap-[50px] lg:flex-row lg:justify-between">
          {TEAM_MEMBERS.map((member, i) => (
            <BioCard
              key={member.name}
              member={member}
              index={i}
              accent={i === 0 ? "#00E5FF" : "#EC5793"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}