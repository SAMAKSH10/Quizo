import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

interface Quiz {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/quizzes")
      .then((res) => res.json())
      .then((data) => setQuizzes(data));
  }, []);

  const handleDelete = (id: number) => {
    fetch(`http://localhost:5000/api/quizzes/${id}`, { method: "DELETE" }).then(() =>
      setQuizzes(quizzes.filter((q) => q.id !== id))
    );
  };

  return (
    <div className="flex min-h-screen bg-black text-white p-8">
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold cursor-pointer">Quizzes</h1>
          <Button onClick={() => navigate("/quiz/new")} className="bg-white text-black hover:bg-gray-100 cursor-pointer">Create Quiz</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="bg-gray-700 text-white">
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{quiz.description}</p>
                <p className="text-sm text-gray-500">Created on: {new Date(quiz.created_at).toLocaleDateString()}</p>
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => navigate(`/quiz/${quiz.id}`)} className="bg-blue-500">Edit</Button>
                  <Button onClick={() => handleDelete(quiz.id)} className="bg-red-500">Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
