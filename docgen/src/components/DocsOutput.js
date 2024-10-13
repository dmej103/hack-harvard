import React from 'react';

const DocsOutput = ({ output }) => {
  if (!output) {
    console.log('No output to display');  // Log if no output is passed
    return null;
  }

  console.log('Output received:', output);  // Log output

  return (
    <div className="mt-4">
      <span className={output.message.includes('generated') ? 'text-custom-red' : 'text-white'}>
        {output.message}
      </span>
      {output.link && (
        <a
          href={output.link}
          target="_blank"              // Opens link in a new tab
          rel="noopener noreferrer"    // Security best practice when opening new tabs
          className="text-blue-500 underline mt-2 block"
        >
          View Documentation
        </a>
      )}
    </div>
  );
};

export default DocsOutput;
