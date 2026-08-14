import express from "express";
import subjects from "./routes/subjects"
import cors from "cors";

const app = express();
const port = 8000;

app.use(express.json());

if (!process.env.FRONTEND_URL) throw new Error("FRONTEND_URL not specified in environment.")
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

app.use('/api/subjects', subjects)

app.get("/", (_req, res) => {
  res.send("Welcome to Classroom API");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});