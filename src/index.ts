import express from "express";

const app = express();
const port = 8000;

app.use(express.json())

app.get('/', (_req, res) => {
  res.send('Welcome to Classroom API');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});