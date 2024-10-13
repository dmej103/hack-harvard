import { detectLanguage } from './nlpEngine'; // Assuming you have a JS equivalent of nlp_engine
import { extractRelevantSnippets } from './codeExtractor'; // Assuming you have the JS code extractor

// Function to generate markdown content in the browser
async function generateMarkdown(enhancedDocs) {
  const generatedFiles = new Set();
  
  for (const doc of enhancedDocs) {
    const filePath = doc.file_path;
    const fileName = filePath.split('/').pop();
    
    // Create a unique identifier for each file (using crypto API for hashing)
    const fileHash = await crypto.subtle.digest('MD5', new TextEncoder().encode(filePath));
    const hashArray = Array.from(new Uint8Array(fileHash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 8);
    const uniqueFileName = `${fileName}_${hashHex}.md`;
    
    // Construct the markdown content
    let markdownContent = `# ${fileName}\n\n`;
    markdownContent += `File path: ${filePath}\n\n`;
    markdownContent += `## Explanation\n${doc.explanation}\n\n`;
    markdownContent += `## Code Snippets\n`;

    const language = detectLanguage(filePath, doc.content);
    const snippets = extractRelevantSnippets(doc.content, language);

    snippets.forEach((snippet, index) => {
      markdownContent += `### Snippet ${index + 1}\n`;
      markdownContent += `\`\`\`${language.toLowerCase()}\n${snippet}\n\`\`\`\n\n`;
    });

    // Provide the markdown content for download or display
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Add the generated file to the set of downloadable files
    generatedFiles.add({
      fileName: uniqueFileName,
      url: url
    });
    
    console.log(`Generated: ${uniqueFileName}`);
  }
  
  console.log(`Generated ${generatedFiles.size} markdown files.`);
  return generatedFiles;
}

// Example usage (You could call this function when users upload or link files):
// const enhancedDocs = [
//   { file_path: "path/to/file.js", content: "file content", explanation: "This is a JS file..." }
// ];
// generateMarkdown(enhancedDocs).then(files => {
//   files.forEach(file => {
//     // You can create a download link in the DOM using file.url and file.fileName
//     console.log(`Markdown file generated: ${file.fileName} - Download URL: ${file.url}`);
//   });
// });
