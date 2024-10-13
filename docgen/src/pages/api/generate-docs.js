// pages/api/generate-docs.js
import { docgen } from '../../lib/docGen'; // Adjust the path as necessary


export default async function handler(req, res) {
    const { repo } = req.body;
  
    try {
      // Validate the repository URL
      if (!repo || !repo.startsWith('https://github.com/')) {
        return res.status(400).json({ success: false, message: 'Invalid repository URL' });
      }
  
      // Call the docgen function with the repo link
      const result = await docgen({ repo });
  
      // Check if result contains any errors
      if (result.error) {
        return res.status(500).json({ success: false, message: result.error });
      }
  
      // If successful, return the documentation link and other information
      return res.status(200).json({
        success: true,
        docLink: result.link,
        details: result.details, // Include any additional parsed information here
      });
    } catch (error) {
      console.error('Error in API:', error); // Log the error for debugging
      return res.status(500).json({ success: false, message: error.message || 'An error occurred while generating documentation' });
    }
}