import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Admin from "./pages/Admin";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";
import ForgotPassword from "./pages/ForgotPassword";
import ResearcherApplication from "./pages/ResearcherApplication";
import CreateQuiz from "./pages/CreateQuiz";
import BrowseQuizzes from "./pages/BrowseQuizzes";
import TakeQuiz from "./pages/TakeQuiz";
import Home from "./pages/Home";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages (no navbar) */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher-verification" element={<ResearcherApplication />} />

        {/* Protected pages (with navbar & footer) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/quizzes" element={<BrowseQuizzes />} />
        <Route path="/take-quiz/:id" element={<TakeQuiz />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
