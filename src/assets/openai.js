import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_REACT_APP_OPENAI_API_KEY,dangerouslyAllowBrowser: true
});

export const sendMessage = async () => {
    const prompt =`"웹 개발자" 직무면접 준비를 위해 "1~2년차" 수준에 맞는 면접 질문 1개만 보여줘.
- 질문 외 다른 문장은 절대 포함하지 마.
- 아래 JSON 형태로 반환해.
{
  "question": ["질문 1"]
}`;
    try {
        const res = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            store: true,
            messages: [
                { role: "user", content: prompt },
            ],
        });
        return Promise.resolve(res);
    } catch (error) {
        return Promise.reject(error);
    }
}

export const sendAnswer = async (content) => {
      const prompt = `면접 질문에 대한 나의 답변: "${content}"
이 답변을 참고해서 다음 질문 하나만 이어서 해줘. 답변에 대한 꼬리질문이어도 되고, 새로운 질문이어도 괜찮아.
- 질문 외 다른 문장은 포함하지 마.
- 아래 JSON 형태로 반환해.
{
  "question": ["질문 2"]
}`;
    try {
        const res = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            store: true,
            messages: [
                { role: "user", content: prompt },
            ],
        });
        return Promise.resolve(res);
    } catch (error) {
        return Promise.reject(error);
    }
}