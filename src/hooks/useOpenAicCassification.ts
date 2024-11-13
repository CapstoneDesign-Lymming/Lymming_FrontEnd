import { useEffect, useState } from "react";
import OpenAi from "openai";
import { useInfoStore } from "../store/useLoginStore";

//1차 테스트 완료후 사용자 정보 store에서 불러오기, 분류한 정보 사용자 정보에 넣고 회원가입시 같이 전달

export const useOpenAicCassification = () => {
  const [userType, setUserType] = useState<number | null>(null);
  const { data } = useInfoStore();

  const openai = new OpenAi({
    apiKey:
      "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",
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    classifyUser();
  }, []);

  //임시 사용자 정보를 기반으로 유형 분류 함수
  const classifyUser = async () => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "네 가지의 유형이 있습니다: " +
              "1) 독립적인 문제 해결자 (새벽선호 개인 작업 선호,즉흥적 단기 프로젝트 지향적) " +
              "2) 협업을 중시하는 소통형 개발자 (오전선호, 협력 선호 계획적 장기 프로젝트 집중) " +
              "3) 창의적 혁신가 (오후선호 제약 없는 환경선호 즉흥적으로 작업, 단기 프로젝트 선호) " +
              "4) 체계적인 계획적인 실천자 (저녁선호 계획적이고 장기 프로젝트를 선호하며 체계적이고 오프라인 환경에서 작업) " +
              "사용자의 특징에 맞는 유형을 글자 없이 숫자로만 제공해주세요 예를 들어, 1 또는 2와 같은 숫자만 반환해주세요.",
          },
          {
            role: "user",
            content: `사용자의 특성: 개발 스타일 - ${data.devStyle}, 팀과의 작업 - ${data.with_people}, 작업 시간대 - ${data.work_time}, 팀 작업 방식 - ${data.working_team}`,
          },
        ],
      });

      const classification = response.choices[0].message.content?.trim();
      console.log("개발자 유형", classification);
      if (isNaN(Number(classification))) {
        // 만약에 제대로 된 형식이 나오지 않는다면 0 리턴
        setUserType(Number(0));
        console.log("제대로 된 응답 타입이 아닙니다 -  gpt");
      } else {
        setUserType(Number(classification));
      }
    } catch (error) {
      console.error("Error classifying user:", error);
    }
  };

  return { userType };
};
