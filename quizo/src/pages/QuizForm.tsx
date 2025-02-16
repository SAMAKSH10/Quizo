import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../components/ui/dialog";
import * as Accordion from "@radix-ui/react-accordion";
import { Loader2 } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions?: Question[];
}

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [newQuizDescription, setNewQuizDescription] = useState("");
  const [createQuestions, setCreateQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
  });
  const [creating, setCreating] = useState(false);

  // State for editing a quiz
  const [editQuiz, setEditQuiz] = useState<Quiz | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedQuizTitle, setEditedQuizTitle] = useState("");
  const [editedQuizDescription, setEditedQuizDescription] = useState("");
  const [editedQuestions, setEditedQuestions] = useState<Question[]>([]);
  const [editedNewQuestion, setEditedNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
  });
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();

  // Fetch quizzes from the backend
  useEffect(() => {
    fetch("http://localhost:5000/api/quizzes")
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch((err) => console.error(err));
  }, []);

  // ---------- Create Modal Handlers ----------
  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const updatedOptions = [...newQuestion.options];
      updatedOptions[index] = value;
      setNewQuestion({ ...newQuestion, options: updatedOptions });
    } else {
      setNewQuestion({ ...newQuestion, [name]: value });
    }
  };

  const handleAddCreateQuestion = () => {
    if (
      !newQuestion.question ||
      newQuestion.options.some((opt) => opt.trim() === "") ||
      !newQuestion.answer
    ) {
      toast.error("Please fill in all fields for the question.");
      return;
    }
    setCreateQuestions([...createQuestions, { id: createQuestions.length + 1, ...newQuestion }]);
    toast.success("Question added!");
    setNewQuestion({ question: "", options: ["", "", "", ""], answer: "" });
  };

  const handleCreateQuiz = async () => {
    if (!newQuizTitle || !newQuizDescription || createQuestions.length === 0) {
      toast.error("Please add a title, description, and at least one question.");
      return;
    }
    setCreating(true);
    try {
      const response = await fetch("http://localhost:5000/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newQuizTitle, description: newQuizDescription, questions: createQuestions }),
      });
      if (!response.ok) throw new Error("Failed to create quiz");
      toast.success("Quiz created successfully!");
      setIsCreateDialogOpen(false);
      // Refresh quizzes
      const updatedQuizzes = await fetch("http://localhost:5000/api/quizzes").then((res) => res.json());
      setQuizzes(updatedQuizzes);
      setNewQuizTitle("");
      setNewQuizDescription("");
      setCreateQuestions([]);
    } catch (error) {
      console.error(error);
      toast.error("Error creating quiz");
    } finally {
      setCreating(false);
    }
  };

  // ---------- Edit Modal Handlers ----------
  const openEditModal = (quiz: Quiz) => {
    setEditQuiz(quiz);
    setEditedQuizTitle(quiz.title);
    setEditedQuizDescription(quiz.description);
    setEditedQuestions(quiz.questions || []);
    setEditedNewQuestion({ question: "", options: ["", "", "", ""], answer: "" });
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      const updatedOptions = [...editedNewQuestion.options];
      updatedOptions[index] = value;
      setEditedNewQuestion({ ...editedNewQuestion, options: updatedOptions });
    } else {
      setEditedNewQuestion({ ...editedNewQuestion, [name]: value });
    }
  };

  const handleAddEditedQuestion = () => {
    if (
      !editedNewQuestion.question ||
      editedNewQuestion.options.some((opt) => opt.trim() === "") ||
      !editedNewQuestion.answer
    ) {
      toast.error("Please fill in all fields for the question.");
      return;
    }
    setEditedQuestions([...editedQuestions, { id: editedQuestions.length + 1, ...editedNewQuestion }]);
    toast.success("Question added!");
    setEditedNewQuestion({ question: "", options: ["", "", "", ""], answer: "" });
  };

  const handleUpdateQuiz = async () => {
    if (!editedQuizTitle || !editedQuizDescription || editedQuestions.length === 0 || !editQuiz) {
      toast.error("Please ensure the title, description and at least one question are provided.");
      return;
    }
    setUpdating(true);
    try {
      const response = await fetch(`http://localhost:5000/api/quizzes/${editQuiz.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editedQuizTitle, description: editedQuizDescription, questions: editedQuestions }),
      });
      if (!response.ok) throw new Error("Failed to update quiz");
      toast.success("Quiz updated successfully!");
      setIsEditDialogOpen(false);
      // Refresh quizzes
      const updatedQuizzes = await fetch("http://localhost:5000/api/quizzes").then((res) => res.json());
      setQuizzes(updatedQuizzes);
      setEditQuiz(null);
    } catch (error) {
      console.error(error);
      toast.error("Error updating quiz");
    } finally {
      setUpdating(false);
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/quizzes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete quiz");
      toast.success("Quiz deleted successfully!");
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
    } catch (error) {
      toast.error("Error deleting quiz");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          {/* Create Quiz Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white">Create Quiz</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white p-8 overflow-y-auto max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Create New Quiz</DialogTitle>
                <DialogClose />
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Label htmlFor="quiz-title" className="text-black">
                  Quiz Title
                </Label>
                <Input
                  id="quiz-title"
                  placeholder="Enter quiz title"
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  className="bg-gray-100 text-black border border-gray-300"
                />
                <Label htmlFor="quiz-description" className="text-black">
                  Quiz Description
                </Label>
                <Input
                  id="quiz-description"
                  placeholder="Enter quiz description"
                  value={newQuizDescription}
                  onChange={(e) => setNewQuizDescription(e.target.value)}
                  className="bg-gray-100 text-black border border-gray-300"
                />
                <div>
                  <Label className="text-black">Add a Question</Label>
                  <Input
                    type="text"
                    name="question"
                    value={newQuestion.question}
                    onChange={(e) => handleCreateInputChange(e)}
                    placeholder="Enter question"
                    className="bg-gray-100 text-black border border-gray-300 mt-1"
                  />
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="mt-1">
                      <Label htmlFor={`create-option-${index}`} className="text-black">
                        {`Option ${index + 1}`}
                      </Label>
                      <Input
                        id={`create-option-${index}`}
                        type="text"
                        value={option}
                        onChange={(e) => handleCreateInputChange(e, index)}
                        placeholder={`Option ${index + 1}`}
                        className="bg-gray-100 text-black border border-gray-300"
                      />
                    </div>
                  ))}
                  <Label htmlFor="create-correct-answer" className="text-black mt-1">
                    Correct Answer
                  </Label>
                  <Input
                    id="create-correct-answer"
                    type="text"
                    name="answer"
                    value={newQuestion.answer}
                    onChange={(e) => handleCreateInputChange(e)}
                    placeholder="Correct answer"
                    className="bg-gray-100 text-black border border-gray-300 mt-1"
                  />
                  <Button
                    onClick={handleAddCreateQuestion}
                    className="mt-2 bg-black text-white w-full"
                  >
                    Add Question to Quiz
                  </Button>
                </div>
                {createQuestions.length > 0 && (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold text-black">Questions Added</h2>
                    <ScrollArea className="max-h-60">
                      <Accordion.Root type="single" collapsible className="space-y-2">
                        {createQuestions.map((q) => (
                          <Accordion.Item
                            key={q.id}
                            value={`create-item-${q.id}`}
                            className="border border-gray-300 rounded"
                          >
                            <Accordion.Header>
                              <Accordion.Trigger className="w-full text-left px-4 py-2 text-black font-medium">
                                {q.question}
                              </Accordion.Trigger>
                            </Accordion.Header>
                            <Accordion.Content className="px-4 py-2">
                              <ul className="pl-4 space-y-1 text-gray-700">
                                {q.options.map((opt, i) => (
                                  <li key={i}>• {opt}</li>
                                ))}
                              </ul>
                              <p className="mt-2 text-gray-600">Answer: {q.answer}</p>
                            </Accordion.Content>
                          </Accordion.Item>
                        ))}
                      </Accordion.Root>
                    </ScrollArea>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <Button
                  onClick={handleCreateQuiz}
                  className="bg-black text-white w-full"
                  disabled={creating}
                >
                  {creating ? <Loader2 className="animate-spin w-5 h-5" /> : "Create Quiz"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {/* Edit Quiz Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <div className="hidden" />
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white p-8 overflow-y-auto max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Edit Quiz</DialogTitle>
                <DialogClose />
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Label htmlFor="edit-quiz-title" className="text-black">
                  Quiz Title
                </Label>
                <Input
                  id="edit-quiz-title"
                  placeholder="Enter quiz title"
                  value={editedQuizTitle}
                  onChange={(e) => setEditedQuizTitle(e.target.value)}
                  className="bg-gray-100 text-black border border-gray-300"
                />
                <Label htmlFor="edit-quiz-description" className="text-black">
                  Quiz Description
                </Label>
                <Input
                  id="edit-quiz-description"
                  placeholder="Enter quiz description"
                  value={editedQuizDescription}
                  onChange={(e) => setEditedQuizDescription(e.target.value)}
                  className="bg-gray-100 text-black border border-gray-300"
                />
                <div>
                  <Label className="text-black">Edit/Add a Question</Label>
                  <Input
                    type="text"
                    name="question"
                    value={editedNewQuestion.question}
                    onChange={(e) => handleEditInputChange(e)}
                    placeholder="Enter question"
                    className="bg-gray-100 text-black border border-gray-300 mt-1"
                  />
                  {editedNewQuestion.options.map((option, index) => (
                    <div key={index} className="mt-1">
                      <Label htmlFor={`edit-option-${index}`} className="text-black">
                        {`Option ${index + 1}`}
                      </Label>
                      <Input
                        id={`edit-option-${index}`}
                        type="text"
                        value={option}
                        onChange={(e) => handleEditInputChange(e, index)}
                        placeholder={`Option ${index + 1}`}
                        className="bg-gray-100 text-black border border-gray-300"
                      />
                    </div>
                  ))}
                  <Label htmlFor="edit-correct-answer" className="text-black mt-1">
                    Correct Answer
                  </Label>
                  <Input
                    id="edit-correct-answer"
                    type="text"
                    name="answer"
                    value={editedNewQuestion.answer}
                    onChange={(e) => handleEditInputChange(e)}
                    placeholder="Correct answer"
                    className="bg-gray-100 text-black border border-gray-300 mt-1"
                  />
                  <Button
                    onClick={handleAddEditedQuestion}
                    className="mt-2 bg-black text-white w-full"
                  >
                    Add Question to Quiz
                  </Button>
                </div>
                {editedQuestions.length > 0 && (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold text-black">Questions Added</h2>
                    <ScrollArea className="max-h-60">
                      <Accordion.Root type="single" collapsible className="space-y-2">
                        {editedQuestions.map((q) => (
                          <Accordion.Item
                            key={q.id}
                            value={`edit-item-${q.id}`}
                            className="border border-gray-300 rounded"
                          >
                            <Accordion.Header>
                              <Accordion.Trigger className="w-full text-left px-4 py-2 text-black font-medium">
                                {q.question}
                              </Accordion.Trigger>
                            </Accordion.Header>
                            <Accordion.Content className="px-4 py-2">
                              <ul className="pl-4 space-y-1 text-gray-700">
                                {q.options.map((opt, i) => (
                                  <li key={i}>• {opt}</li>
                                ))}
                              </ul>
                              <p className="mt-2 text-gray-600">Answer: {q.answer}</p>
                            </Accordion.Content>
                          </Accordion.Item>
                        ))}
                      </Accordion.Root>
                    </ScrollArea>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <Button
                  onClick={handleUpdateQuiz}
                  className="bg-black text-white w-full"
                  disabled={updating}
                >
                  {updating ? <Loader2 className="animate-spin w-5 h-5" /> : "Update Quiz"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {quizzes.length === 0 ? (
        <div className="text-center text-gray-500">Nothing to show</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="border border-gray-300 bg-gray-50 shadow-md">
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">{quiz.description}</p>
                <ul className="space-y-2">
                  {(quiz.questions || []).map((q) => (
                    <li key={q.id} className="text-gray-700">
                      {q.question}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => openEditModal(quiz)}
                    className="bg-white text-black hover:bg-gray-50 cursor-pointer"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="bg-black text-white cursor-pointer"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
