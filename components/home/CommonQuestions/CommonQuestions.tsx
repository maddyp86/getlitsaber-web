import ResponsiveMount from "@/components/primitives/ResponsiveMount";
import CommonQuestionsDesktop from "./CommonQuestionsDesktop";
import CommonQuestionsMobile from "./CommonQuestionsMobile";

export default function CommonQuestions() {
  return (
    <ResponsiveMount
      mobile={<CommonQuestionsMobile />}
      desktop={<CommonQuestionsDesktop />}
    />
  );
}
