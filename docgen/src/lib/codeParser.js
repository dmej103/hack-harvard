// Function to parse code from provided URLs
async function parseCode(urls) {
    const codeData = [];
    console.log(`Parsing code from provided URLs...`);
  
    for (const url of urls) {
      // Check if the file is one of the supported formats
      if (url.match(/\.(js|jsx|ts|tsx|py|java|html|css)$/)) {
        console.log(`Fetching content from: ${url}`);
        try {
          const response = await fetch(url);
          const content = await response.text();
          codeData.push({
            file_path: url,
            content: content
          });
        } catch (error) {
          console.error(`Error fetching the file from ${url}:`, error);
        }
      } else {
        console.warn(`Unsupported file type for URL: ${url}`);
      }
    }
  
    console.log(`Total files parsed: ${codeData.length}`);
    return codeData;
  }
  
  // Example usage:
  // const urls = ["https://example.com/script.js", "https://example.com/styles.css"];
  // parseCode(urls).then(data => console.log(data));
  