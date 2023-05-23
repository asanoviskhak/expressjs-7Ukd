import express from 'express';
import cors from 'cors';
import axios from 'axios';

export const app = express();

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

// Healthcheck endpoint
app.get('/', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

const api = express.Router();

api.get('/hello', (req, res) => {
  res.status(200).send({ message: 'hello world' });
});

/// make request to the openAi completion api which will take params from the request body = {prompt: string, max_tokens: number} using axios
api.post('/openai', async (req, res) => {
  console.log(req.body);
  const { prompt, max_tokens, model } = req.body;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        prompt,
        max_tokens,
        temperature: 0.9,
        model: model || 'text-davinci-003'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );
    console.log(response.data);
    res.status(200).send(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

// Version the api
app.use('/api/v1', api);
