import { BrowserRouter as Router, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import QuizForm from "./pages/QuizForm";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz/:id?" element={<QuizForm />} />
      </Routes>
    </Router>
  );
}

export default App;