import express from "express";
import subjects from "./routes/subjects"

const app = express();
const port = 8000;

app.use(express.json());

app.use('/api/subjects', subjects)

app.get("/", (_req, res) => {
  res.send("Welcome to Classroom API");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});