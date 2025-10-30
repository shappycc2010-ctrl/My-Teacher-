import { useState, useEffect } from "react";

export default function MrKellyWelcome() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  const greetingText = `Hello there! 👋 What’s your name, student?`;

  useEffect(() => {
    if (!submitted && index < greetingText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + greetingText[index]);
        setIndex(index + 1);
      }, 50); // typing speed
      return () => clearTimeout(timeout);
    }
  }, [index, submitted]);

  const handleSubmit = () => {
    if (name.trim()) setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white font-mono">
      {!submitted ? (
        <div className="text-center max-w-lg px-6">
          <h2 className="text-2xl mb-6 animate-fadeIn">{displayText}</h2>
          {index === greetingText.length && (
            <div className="flex flex-col items-center gap-4 animate-fadeIn">
              <input
                className="p-2 text-black rounded w-64 outline-none text-center"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      ) : (
        <TypewriterMessage name={name} />
      )}
    </div>
  );
}

function TypewriterMessage({ name }) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const message = `Nice to meet you, ${name}! 😄 Welcome to class. Let’s begin our lesson on web creation...`;

  useEffect(() => {
    if (i < message.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + message[i]);
        setI(i + 1);
      }, 45);
      return () => clearTimeout(timeout);
    }
  }, [i]);

  return (
    <div className="text-center max-w-xl px-6 animate-fadeIn">
      <p className="text-lg">{text}</p>
    </div>
  );
                       }
import Lottie from "lottie-react";
import teacherAnimation from "./mrkelly-male.json"; // animated male avatar (Lottie file)

export default function MrKellyAvatar({ isSpeaking }) {
  return (
    <div className="relative w-40 h-40">
      <Lottie
        animationData={teacherAnimation}
        loop={isSpeaking}
        autoplay={isSpeaking}
        className="rounded-full border-4 border-blue-500 shadow-lg"
      />
      <div className="absolute bottom-0 right-0 bg-green-500 text-xs px-2 py-1 rounded-full">
        {isSpeaking ? "Speaking..." : "Idle"}
      </div>
    </div>
  );
        }
