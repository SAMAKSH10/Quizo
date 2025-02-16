import express from "express";
import { getQuizzes, addQuiz, removeQuiz } from "../controllers/quizController";

const router = express.Router();

router.get("/", getQuizzes);
router.post("/", addQuiz);
router.delete("/:id", removeQuiz);

export default router;
