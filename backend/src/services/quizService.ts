import { pool } from "../config/database";

// Retrieve all quizzes along with their questions
export const getAllQuizzes = async () => {
  // Get quizzes
  const [quizRows]: any = await pool.query("SELECT * FROM quizzes");
  // For each quiz, get its questions
  for (const quiz of quizRows) {
    const [questionRows]: any = await pool.query("SELECT * FROM questions WHERE quiz_id = ?", [quiz.id]);
    quiz.questions = questionRows;
  }
  return quizRows;
};

// Create a quiz and insert its questions in the questions table
export const createQuiz = async (title: string, questions: any[]) => {
  // Insert into quizzes table; created_at is auto-handled by NOW()
  const [result]: any = await pool.query(
    "INSERT INTO quizzes (title, created_at) VALUES (?, NOW())",
    [title]
  );
  const quizId = result.insertId;

  // Insert each question
  for (const question of questions) {
    await pool.query(
      "INSERT INTO questions (quiz_id, question, options, answer, created_at) VALUES (?, ?, ?, ?, NOW())",
      [quizId, question.question, JSON.stringify(question.options), question.answer]
    );
  }
  return quizId;
};


export const updateQuiz = async (id: number, title: string, questions: any[]) => {

  await pool.query("UPDATE quizzes SET title = ? WHERE id = ?", [title, id]);

  await pool.query("DELETE FROM questions WHERE quiz_id = ?", [id]);
 
  for (const question of questions) {
    await pool.query(
      "INSERT INTO questions (quiz_id, question, options, answer, created_at) VALUES (?, ?, ?, ?, NOW())",
      [id, question.question, JSON.stringify(question.options), question.answer]
    );
  }
};

export const deleteQuiz = async (id: number) => {
  await pool.query("DELETE FROM quizzes WHERE id = ?", [id]);
};
