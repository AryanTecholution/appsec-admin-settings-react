import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminSettings from "./components/AdminSettings/AdminSettings";
import "../src/styles/global.css";
const App = () => {
  console.log("Ssssss", process.env.REACT_APP_BASE_URL);

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/admin-settings/operations" replace />}
      />
      <Route path="/admin-settings/:tab" element={<AdminSettings />} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default App;
