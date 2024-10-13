// nlpEngine.js

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("No OpenAI API key found. Please provide the OpenAI API key in the .env.local file.");
}

// Function to detect language based on file extension or content
function detectLanguage(filePath, content) {
  const extension = filePath.split('.').pop().toLowerCase();
  switch (extension) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return 'JavaScript/TypeScript';
    case 'py':
      return 'Python';
    case 'java':
      return 'Java';
    case 'html':
    case 'htm':
      return 'HTML';
    case 'css':
      return 'CSS';
    default:
      // Guess language based on content if extension is not recognized
      if (content.includes('function') || content.includes('const') || content.includes('let')) {
        return 'JavaScript/TypeScript';
      } else if (content.includes('def ') || content.includes('import ')) {
        return 'Python';
      } else if (content.includes('public class') || content.includes('private')) {
        return 'Java';
      } else {
        return 'Unknown';
      }
  }
}

// Function to generate an explanation using the OpenAI API
async function generateExplanation(filePath, content) {
  const language = detectLanguage(filePath, content);
  const apiUrl = "https://api.openai.com/v1/chat/completions";
  
  const body = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: `You are a helpful assistant that explains ${language} code.` },
      { role: "user", content: `Explain the following ${language} code in simple terms, focusing on its purpose and main components:\n\n${content}` }
    ],
    max_tokens: 150,
    temperature: 0.7
  };
  
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.choices[0].message.content.trim();
    } else {
      throw new Error(`OpenAI API request failed with status: ${response.status}`);
    }
  } catch (error) {
    return `Error generating explanation: ${error.message}`;
  }
}

// Function to generate contextual explanations for multiple files
async function generateContextualExplanations(codeData) {
  const enhancedDocs = [];

  for (const file of codeData) {
    const content = file.content;
    const explanation = await generateExplanation(file.file_path, content);
    
    enhancedDocs.push({
      file_path: file.file_path,
      content: content,
      explanation: explanation
    });
  }
  
  return enhancedDocs;
}

export { generateContextualExplanations, detectLanguage, generateExplanation };
