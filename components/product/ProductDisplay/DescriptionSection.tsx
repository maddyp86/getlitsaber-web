import { DESCRIPTION_HEADING, DESCRIPTION_BODY } from "./productdisplay.content";

export default function DescriptionSection() {
  return (
    <div className="flex flex-col items-start gap-5">
      <h3 className="font-body text-[35px] font-bold text-white leading-normal">
        {DESCRIPTION_HEADING}
      </h3>
      <p className="font-body text-[16px] font-normal text-[#CCC] leading-normal">
        {DESCRIPTION_BODY}
      </p>
    </div>
  );
}
