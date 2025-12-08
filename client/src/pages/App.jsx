// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MentorChatApp from "./MentorChatApp";
import Login from "../components/Login";
import PrivateRoute from "../components/PrivateRoute";
import AdminHome from "./admin/AdminHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminHome />
            </PrivateRoute>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <MentorChatApp />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
