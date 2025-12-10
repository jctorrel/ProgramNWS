// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import AdminHome from "./pages/admin/AdminHome";
import PublicSyllabusPage from './pages/PublicSyllabusPage';
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <Home />
          }
        />

        <Route
          path="/syllabus/:token"
          element={
            <PublicSyllabusPage />
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminHome />
            </PrivateRoute>
          }
        />
      </Routes>
    </ BrowserRouter >
  );
}

export default App;
