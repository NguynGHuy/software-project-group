import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AdminPage from "./pages/admin";
import DriverPage from "./pages/driver";
import ParentPage from "./pages/parent";
import MapViewPage from "./pages/mapview";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AdminLayout>
              <AdminPage />
            </AdminLayout>
          }
        />
        <Route
          path="/drivers"
          element={
            <AdminLayout>
              <DriverPage />
            </AdminLayout>
          }
        />
        <Route
          path="/parent"
          element={
            <AdminLayout>
              <ParentPage />
            </AdminLayout>
          }
        />
        <Route
          path="/mapview"
          element={
            <AdminLayout>
              <MapViewPage />
            </AdminLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
