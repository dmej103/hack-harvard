export const docgen = async ({ repo }) => {
  try {
    // Fetch the repository data
    const repoData = await fetchGitHubRepo(repo);
    if (!repoData || repoData.length === 0) {
      throw new Error('Failed to fetch repository data or no files found.');
    }

    // Parse the code files
    const codeData = await parseCode(repoData);
    if (!codeData || codeData.length === 0) {
      throw new Error('No valid code files found in the repository.');
    }

    // Generate explanations for the parsed code
    const explanations = await generateContextualExplanations(codeData);
    if (!explanations || explanations.length === 0) {
      throw new Error('Failed to generate explanations for the code.');
    }

    // Generate Markdown documentation from the explanations
    const markdownFiles = await generateMarkdown(explanations);
    if (!markdownFiles || markdownFiles.length === 0) {
      throw new Error('Failed to generate Markdown files.');
    }

    // Return the link to the generated documentation and details
    return {
      link: '/docs/generated/documentation.md', // Adjust this path based on your application structure
      details: markdownFiles, // Include more details as needed
    };
  } catch (error) {
    console.error('Error in docgen:', error);
    return { error: error.message || 'An error occurred while processing the documentation' };
  }
};

// Example fetch function for GitHub repository
async function fetchGitHubRepo(repoUrl) {
  try {
    const apiUrl = `https://api.github.com/repos/${getRepoOwnerAndName(repoUrl)}/contents/`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`GitHub API request failed with status: ${response.status}`);
    }
    const repoContents = await response.json();
    
    return repoContents.map(file => ({
      file_path: file.path,
      content_url: file.download_url
    }));
  } catch (error) {
    console.error('Error fetching GitHub repo:', error);
    return null; // Indicate failure
  }
}

// Helper function to extract owner and repo name from the GitHub URL
function getRepoOwnerAndName(repoUrl) {
  const match = repoUrl.match(/github\.com\/([^\/]+\/[^\/]+)/);
  return match ? match[1] : null;
}
