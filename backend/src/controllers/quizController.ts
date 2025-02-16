import { Request, Response } from "express";
import { getAllQuizzes, createQuiz, deleteQuiz } from "../services/quizService";

export const getQuizzes = async (_req: Request, res: Response) => {
  const quizzes = await getAllQuizzes();
  res.json(quizzes);
};

export const addQuiz = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  await createQuiz(title, description);
  res.status(201).json({ message: "Quiz added successfully" });
};

export const removeQuiz = async (req: Request, res: Response) => {
  await deleteQuiz(parseInt(req.params.id));
  res.json({ message: "Quiz deleted successfully" });
};
