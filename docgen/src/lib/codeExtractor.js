// Import required modules for regular expressions (no need for ast in JS)
function extractRelevantSnippets(content, language) {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return extractJsSnippets(content);
      case 'python':
        return extractPythonSnippets(content);
      case 'css':
        return extractCssSnippets(content);
      default:
        return extractGenericSnippets(content);
    }
  }
  
  function extractJsSnippets(content) {
    const snippets = [];
    // Pattern to match function and class declarations, including async functions and arrow functions
    const pattern = /((?:export\s+)?(?:async\s+)?(?:function|class|const|let|var)\s+\w+\s*(?:\([^)]*\))?\s*{?(?:\s*=>)?(?:\s*{)?(?:\s*\n(?:(?!\n\s*\n).)*)?)/g;
    let match;
    while ((match = pattern.exec(content)) !== null) {
      let snippet = match[1].trim();
      // If the snippet is a function or class, include a bit more context
      if (/function|class|=>/.test(snippet)) {
        // Include up to 5 non-empty lines after the declaration
        const lines = snippet.split('\n');
        const additionalLines = content.slice(match.index + match[0].length).split('\n').filter(line => line.trim()).slice(0, 5);
        snippet = [...lines, ...additionalLines].join('\n');
      }
      snippets.push(snippet);
    }
    return snippets;
  }
  
  function extractPythonSnippets(content) {
    const snippets = [];
    // Fall back to regex for Python parsing (since JS has no `ast`)
    const pattern = /((?:async\s+)?(?:def|class)\s+\w+\s*(?:\([^)]*\))?:)/g;
    let match;
    while ((match = pattern.exec(content)) !== null) {
      snippets.push(match[1].trim());
    }
    return snippets;
  }
  
  function extractCssSnippets(content) {
    // Extract CSS rule selectors
    const pattern = /([^{]+)\s*{/g;
    const snippets = [];
    let match;
    while ((match = pattern.exec(content)) !== null) {
      snippets.push(match[1].trim());
    }
    return snippets;
  }
  
  function extractGenericSnippets(content) {
    // For other languages, extract lines that look like declarations
    const pattern = /^[^=;{}()]+[{(]/gm;
    const snippets = [];
    let match;
    while ((match = pattern.exec(content)) !== null) {
      snippets.push(match[0].trim());
    }
    return snippets;
  }
  
  // Example usage:
  // const content = "Some source code here...";
  // const snippets = extractRelevantSnippets(content, 'javascript');
  // console.log(snippets);
  