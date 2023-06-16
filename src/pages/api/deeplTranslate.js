import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { text, target_lang, source_lang, authKey } = req.body;
      const response = await axios.post('https://api-free.deepl.com/v2/translate', { text, target_lang, source_lang }, {
        headers: {
          'Authorization': `DeepL-Auth-Key ${authKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: `An error occurred while trying to translate the text: ${error.toString()}`, data: error.response?.data });
    }
  } else {
    res.status(405).json({ error: 'This endpoint only supports POST requests.' });
  }
}
