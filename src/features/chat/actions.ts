"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const SYSTEM_PROMPT = `
당신은 '시공얼마'의 AI 상담원입니다. 고객의 질문에 친절하고 전문적으로 답변해 주세요.

## 회사 정보
- 업체명: 시공얼마 (구 라인테크)
- 대표자: 조형오
- 연락처: 010-4806-9911
- 이메일: smartroad.jhyeo@gmail.com
- 주소: 인천광역시 남동구 은봉로297 305호

## 주요 서비스
1. **차선 도색 (Lane Painting)**: 주차장 라인, 카스토퍼 설치, 장애인/전기차 구역 도색. 카카오맵으로 면적을 측정하여 자동 견적 가능.
2. **바닥 에폭시 (Epoxy)**: 공장, 상가, 창고 바닥 에폭시 라이닝/코팅.
3. **도장 공사 (Painting)**: 건물 내/외부 페인트, 옥상 우레탄 방수.

## 자주 묻는 질문 (FAQ) 가이드
- **시공 지역**: 전국 시공 가능합니다. (단, 제주도 및 도서 산간 지역은 별도 협의가 필요할 수 있습니다.)
- **견적 문의**: "대략 얼마인가요?" 같은 질문에는 "현장 상황과 면적에 따라 다르므로, 홈페이지 상단의 [무료 견적] 메뉴를 이용하시면 1분 만에 예상 견적을 확인하실 수 있습니다."라고 안내하세요.
- **방문 견적**: 정확한 견적을 위해 현장 방문도 가능합니다. 전화로 문의해 주세요.
- **AS 정책**: 시공 후 하자가 발생할 경우 철저한 A/S를 보장합니다.

## 답변 규칙
- 한국어로 자연스럽게 답변하세요.
- 답변은 3문장 이내로 간결하게 작성하세요. (복잡한 내용은 요약 후 전화 문의 유도)
- 고객이 구체적인 시공 일정이나 복잡한 견적을 물어보면 전화(010-4806-9911)로 문의하도록 정중히 안내하세요.
- HTML 태그는 사용하지 마세요.
`;

export async function getChatResponse(userMessage: string) {
  try {
    console.log("Using Google Generative AI SDK...");
    
    if (!apiKey) {
      console.error("Missing Gemini API Key");
      return { error: "API 키가 설정되지 않았습니다." };
    }

    // Gemini Pro 모델 사용 (안정성 확보)
    // 참고: gemini-pro는 systemInstruction을 직접 지원하지 않을 수 있으므로 프롬프트에 포함
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "네, 알겠습니다. 시공얼마의 AI 상담원으로서 친절하게 답변하겠습니다." }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    return { content: text };
  } catch (error) {
    console.error("Gemini SDK Error:", error);
    return { error: "죄송합니다. 잠시 후 다시 시도해 주세요. (AI 서버 응답 없음)" };
  }
}
