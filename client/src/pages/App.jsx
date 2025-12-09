// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import PrivateRoute from "../components/PrivateRoute";
import AdminHome from "./admin/AdminHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <AdminHome />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
