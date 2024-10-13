import TerminalUI from '@/components/TerminalUI';
import DocsOutput from '@/components/DocsOutput';
import { useState } from 'react';

const IndexPage = () => {
  const [output, setOutput] = useState(null); // New state to manage output

  const handleOutput = (generatedOutput) => {
    setOutput(generatedOutput); // Update the output state when docs are generated
    console.log('Generated output:', generatedOutput); // Log the output
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <TerminalUI onOutputGenerated={handleOutput} /> {/* Pass the handler */}
      {output && <DocsOutput output={output} />} {/* Conditionally render DocsOutput */}
    </div>
  );
};

export default IndexPage;
