// import { useState } from "react";
// import { Configuration, OpenAIApi } from "openai";
// export const openAicCassification = () => {
//   const [userType, setUserType] = useState("");

//   // OpenAI API 설정
//   const configuration = new Configuration({
//     apiKey: "YOUR_OPENAI_API_KEY", // 자신의 OpenAI API 키를 입력하세요
//   });
//   const openai = new OpenAIApi(configuration);

//   // 사용자 정보를 기반으로 유형 분류 함수
//   const classifyUser = async () => {
//     const userInfo = {
//       devStyle: "즉흥적",
//       with_people: "조용한 보조",
//       work_time: "night",
//       working_team: "온라인 선호",
//     };

//     try {
//       const response = await openai.createChatCompletion({
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content:
//               "네 가지의 유형이 있습니다: " +
//               "1) 독립적인 문제 해결자 (조용한 환경과 혼자 작업을 선호하며 주로 야간에 집중력 발휘) " +
//               "2) 협업을 중시하는 소통형 개발자 (팀과의 협력, 유연한 작업시간, 혼합형 작업 방식) " +
//               "3) 창의적 혁신가 (제약 없는 환경에서 새로운 아이디어를 시도하고 창의적 발상을 선호) " +
//               "4) 체계적인 계획적인 실천자 (정해진 시간대에 체계적으로 작업하며 세심한 접근 선호) " +
//               "사용자의 특징에 맞는 유형을 추천하세요.",
//           },
//           {
//             role: "user",
//             content: `사용자의 특성: 개발 스타일 - ${userInfo.devStyle}, 팀과의 작업 - ${userInfo.with_people}, 작업 시간대 - ${userInfo.work_time}, 팀 작업 방식 - ${userInfo.working_team}`,
//           },
//         ],
//       });

//       const classification = response.data.choices[0].message.content;
//       setUserType(classification);
//     } catch (error) {
//       console.error("Error classifying user:", error);
//     }
//   };
// };
