import './App.css'
import { sendMessage, sendAnswer } from './assets/openai.js';
import { DagloAPI } from 'https://actionpower.github.io/dagloapi-js-beta/lib/daglo-api.module.js';
import { useRef, useState } from 'react';

function App() {
  const [transcripts, setTranscripts] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [nextQuestion, setNextQuestion] = useState("");
  // const transcriberRef = useRef(null);

  const handleClickSendMessage = async () => {
    const res = await sendMessage();
    const content = res.choices[0].message.content;
    const parsed = JSON.parse(content);
    setQuestion(parsed.question[0]);
  };

  const handleClickSendAnswer = async () => {
    const answer = transcripts.join(" ");
    setAnswer(answer);
    const res = await sendAnswer(answer);
    const content = res.choices[0].message.content;
    const parsed = JSON.parse(content);
    setNextQuestion(parsed.question[0]); // 다음 질문으로 교체
    setTranscripts([]); // 음성 기록 초기화
  };


  const play = async () => {
    const dagloToken = import.meta.env.VITE_REACT_APP_DAGLO_API_KEY;

    const client = new DagloAPI({
      apiToken: dagloToken
    });

    const transcriber = client.stream.transcriber();

    transcriber.on('transcript', (data) => {
      console.log('[#] onTranscript', data);

      if (data?.text) {
        setTranscripts(prev => [...prev, data.text]);
      }
    });

    let stream;

    try {
      // capture the microphone
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    catch (err) {
      console.log("The following error occured: " + err);
      return alert("getUserMedia not supported on your browser");
    }

    if (stream) {
      transcriber.connect(stream);
    }
  };

  return (
    <div id="liveView" className="videoView">
      <br />
      <button onClick={handleClickSendMessage} className='enable-btn'>질문 시작</button>
      <strong>첫 요청 프롬프트에 대한 답변, 첫 질문</strong>
      <p>{question}</p>
      <button className="enable-btn" onClick={play}>
        <span className="enable-btn-label">Microphone ON</span>
      </button>
      <strong id="result">내가 말하는 내용</strong>
      <div id="transcripts">{transcripts.map((line, idx) => (
        <span key={idx}>{line} </span>
      ))}</div>
      <br></br>
      <button onClick={handleClickSendAnswer} className='enable-btn'>답변 제출</button>
      <strong>내가 보낸 답변</strong>
      <p>{answer}</p>
      <strong>새로운 질문</strong>
      <p>{nextQuestion}</p>
    </div>
  )
}

export default App;
