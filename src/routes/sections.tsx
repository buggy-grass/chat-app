import React from "react";
import { lazy } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

export const MainPage = lazy(() => import("../pages/MainPage"));

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}
