const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const decodeBase64File = (base64) => {
  if (!base64 || typeof base64 !== 'string') return null;
  const pure = base64.includes(',') ? base64.split(',').pop() : base64;
  return Buffer.from(pure, 'base64');
};

const extractTextFromBuffer = async (buffer, fileName = '', mimeType = '') => {
  const loweredName = (fileName || '').toLowerCase();
  const loweredMime = (mimeType || '').toLowerCase();

  if (
    loweredMime.startsWith('text/') ||
    ['.txt', '.md', '.csv', '.json', '.log', '.rtf'].some((ext) => loweredName.endsWith(ext))
  ) {
    return buffer.toString('utf-8');
  }

  if (loweredMime.includes('pdf') || loweredName.endsWith('.pdf')) {
    const parsed = await pdfParse(buffer);
    return parsed?.text || '';
  }

  if (
    loweredMime.includes('wordprocessingml') ||
    loweredName.endsWith('.docx')
  ) {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed?.value || '';
  }

  throw new Error('Unsupported file format. Supported: txt, md, csv, json, log, rtf, pdf, docx');
};

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { fileName, mimeType, base64 } = req.body || {};
    if (!fileName || !base64) {
      return res.status(400).json({ error: 'fileName and base64 are required' });
    }

    const buffer = decodeBase64File(base64);
    if (!buffer) {
      return res.status(400).json({ error: 'Invalid base64 content' });
    }

    const text = await extractTextFromBuffer(buffer, fileName, mimeType);
    if (!text || !text.trim()) {
      return res.status(422).json({ error: 'Could not extract text from this file' });
    }

    return res.status(200).json({
      sourceFile: fileName,
      text: text.slice(0, 120000)
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Failed to extract file text' });
  }
};

