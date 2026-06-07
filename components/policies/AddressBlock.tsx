import { RETURN_ADDRESS } from "@/content/policies/shared";

export default function AddressBlock() {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-label text-eyebrow text-text-muted tracking-widest uppercase mb-1">
        -- {RETURN_ADDRESS.label}
      </p>
      <div className="border border-border-default rounded-sm p-5 font-label text-body-sm text-text-secondary leading-relaxed">
        <p>{RETURN_ADDRESS.recipient}</p>
        <p>{RETURN_ADDRESS.attn}</p>
        <p>{RETURN_ADDRESS.line1}</p>
        <p>{RETURN_ADDRESS.line2}</p>
      </div>
    </div>
  );
}
