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

function RoleTags({ roles }: { roles: string[] }) {
  return (
    <>
      {/* Desktop: single inline string */}
      <p className="hidden lg:block font-label text-[12px] tracking-[0.18em] uppercase text-text-muted">
        {roles.join(" · ")}
      </p>
      {/* Mobile: pill chips */}
      <div className="flex lg:hidden flex-wrap gap-2 mt-1">
        {roles.map((role) => (
          <span
            key={role}
            className="px-2.5 py-1 rounded-pill border border-[#2D1C53] bg-[#110826] font-label text-[10px] tracking-[0.12em] uppercase text-text-muted"
          >
            {role}
          </span>
        ))}
      </div>
    </>
  );
}

function BioCard({ member, index }: { member: TeamMember; index: number }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
    >
      {/* Square headshot */}
      <div className="relative w-full aspect-square max-w-[320px] mx-auto lg:mx-0 rounded-card overflow-hidden bg-surface-card">
        <Image
          src={member.imageSrc}
          alt={member.imageAlt}
          fill
          sizes="(min-width: 1024px) 320px, 80vw"
          className="object-cover object-top"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <h3
          className="font-display font-bold text-white"
          style={{ fontSize: "clamp(20px, 2.2vw, 26px)" }}
        >
          {member.name}
        </h3>
        <RoleTags roles={member.roles} />
      </div>

      <p className="font-body text-body-sm text-text-secondary leading-relaxed">
        {member.bio}
      </p>
    </motion.div>
  );
}

export default function AboutTeam() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      className="relative w-full bg-[#080516]"
      aria-label="The team"
    >
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
          style={{ fontSize: "clamp(45px, 6vw, 75px)" }}
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.05, ease: EASE }}
        >
          {TEAM_HEADLINE}
        </motion.h2>

        <motion.p
          className="font-body text-body-sm lg:text-body text-text-secondary leading-relaxed max-w-[680px] mb-14"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          {TEAM_INTRO}
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {TEAM_MEMBERS.map((member, i) => (
            <BioCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
