import pdfParse from 'pdf-parse';

/**
 * Extracts raw text from a PDF Buffer
 * @param {Buffer} buffer - The PDF file buffer
 * @returns {Promise<string>} - Extracted text
 */
export async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    const text = data.text ? data.text.trim() : '';

    if (!text || text.length < 50) {
      throw new Error(
        'The uploaded PDF appears to be empty or contains scanned images without selectable text. Please upload a text-based resume PDF.'
      );
    }

    // Clean up excessive whitespace
    return text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  } catch (error) {
    console.error('PDF parsing error:', error.message);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

