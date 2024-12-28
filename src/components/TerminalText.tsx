import React, { useState, useEffect } from 'react';

interface TerminalTextProps {
  text: string;
  typingSpeed?: number; // Optional prop for customizing typing speed (milliseconds per character)
}

const TerminalText: React.FC<TerminalTextProps> = ({ text, typingSpeed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, typingSpeed]);

  return (
    <div className="terminal-text">
      {displayedText}
      <span className="terminal-cursor">|</span> {/* Blinking cursor */}
      <style>{`
        .terminal-text {
          font-family: 'Courier New', Courier, monospace;
          background-color: black;
          color: #0f0; /* Green text */
          padding: 20px;
          width: 100%;
          height: 100%;
          white-space: pre-wrap; /* Preserve line breaks */
          position: relative; /* For cursor positioning */
        }

        .terminal-cursor {
          color: #0f0; /* Green cursor */
          animation: blink 1s step-end infinite;
          position: absolute;
          bottom: 10px; /* Adjust as needed */
          right: 10px; /* Adjust as needed */
        }

        @keyframes blink {
          from,
          to {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default TerminalText;
