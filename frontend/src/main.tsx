import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import DevelopersPage from "./pages/DevelopersPage";
import DeveloperDetailPage from "./pages/DeveloperDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="developers" element={<DevelopersPage />} />

          <Route
            path="developers/:developerId"
            element={<DeveloperDetailPage />}
          />

          <Route path="projects" element={<ProjectsPage />} />

          <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
