// TerminalUI.js
import { useState, useEffect } from 'react';

const TerminalUI = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(null);
  const [history, setHistory] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [blinking, setBlinking] = useState(true);

  useEffect(() => {
    const handlePasteOrType = (e) => {
      if (e.clipboardData) {
        const pasteText = e.clipboardData.getData('Text');
        setInput(pasteText);
        setCursorPosition(pasteText.length);
      }
    };

    document.addEventListener('paste', handlePasteOrType);
    return () => {
      document.removeEventListener('paste', handlePasteOrType);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleGenerate();
      setBlinking(false);
    } else if (e.key === 'Backspace') {
      if (cursorPosition > 0) {
        setInput((prevInput) => {
          const newInput = prevInput.slice(0, cursorPosition - 1) + prevInput.slice(cursorPosition);
          return newInput;
        });
        setCursorPosition((prevPos) => prevPos - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      setCursorPosition((prevPos) => Math.max(0, prevPos - 1));
    } else if (e.key === 'ArrowRight') {
      setCursorPosition((prevPos) => Math.min(input.length, prevPos + 1));
    } else if (e.key === 'z' && e.ctrlKey) {
      if (history.length > 0) {
        const lastState = history[history.length - 1];
        setHistory(history.slice(0, -1));
        setInput(lastState);
      }
    } else if (e.key.length === 1) {
      setHistory((prevHistory) => [...prevHistory, input]);
      setInput((prevInput) => {
        const newInput = prevInput.slice(0, cursorPosition) + e.key + prevInput.slice(cursorPosition);
        return newInput;
      });
      setCursorPosition((prevPos) => prevPos + 1);
    }
  };

  const handleGenerate = async () => {
    const isValidRepo = input.startsWith('https://github.com/') && input.endsWith('.git');

    if (isValidRepo) {
      try {
        const response = await fetch('/api/generate-docs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repo: input }),
        });

        const data = await response.json();

        if (data.success) {
          const message = `Repository documentation generated: ${data.docLink}`;
          const details = data.details || "No additional details available.";
          setOutput({ message, details });
          console.log(message); // Log the success message
        } else {
          const errorMessage = data.message || 'Error generating documentation';
          setOutput({ message: errorMessage });
          console.error(errorMessage); // Log the error
        }

      } catch (error) {
        console.error('Error:', error);
        setOutput({ message: 'An error occurred while communicating with the server.' });
      }
    } else {
      setOutput({ message: `Invalid Input, Garbage Output` });
    }
};


  return (
    <div className="bg-black text-white p-6 font-mono min-h-screen" onKeyDown={handleKeyDown} tabIndex={0}>
      <div>
        <span className="text-custom-yellow">docGen ~/User1</span> <br />
        <span className="text-custom-red">$ docGen </span>
        <span className="text-white">
          {input.slice(0, cursorPosition)}
          <span
            className={`blinking-cursor ${!blinking ? 'stop-blink' : ''}`}
            style={{
              display: 'inline-block',
              width: '2px',
              height: '1.5em',
              backgroundColor: 'white',
              animation: blinking ? 'blink 0.5s steps(2, start) infinite' : 'none',
            }}
          >
            |
          </span>
          {input.slice(cursorPosition)}
        </span>
      </div>

      {/* Display output directly below the terminal input */}
      {output && (
        <div className="mt-4 text-white">
          <p>{output.message}</p>
          <p>{output.details}</p>
          {output.link && (
            <a href={output.link} className="text-custom-yellow" target="_blank" rel="noopener noreferrer">
              {output.link}
            </a>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.1; }
          100% { opacity: 1; }
        }

        .blinking-cursor {
          height: 1.5em;
          width: 2px;
        }

        .stop-blink {
          animation: none; // Stop blinking when the input is submitted
        }

        .text-custom-yellow {
          color: #FBFF00;
        }

        .text-custom-red {
          color: #E71939;
        }
      `}</style>
    </div>
  );
};

export default TerminalUI;
