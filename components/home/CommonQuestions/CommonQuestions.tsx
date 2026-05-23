import CommonQuestionsDesktop from "./CommonQuestionsDesktop";
import CommonQuestionsMobile from "./CommonQuestionsMobile";

export default function CommonQuestions() {
  return (
    <>
      <div className="hidden lg:block">
        <CommonQuestionsDesktop />
      </div>
      <div className="lg:hidden">
        <CommonQuestionsMobile />
      </div>
    </>
  );
}
