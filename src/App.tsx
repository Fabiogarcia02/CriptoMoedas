import "./App.css"; // Se existir
// import "./index.css"; // Remova se já estiver no main.tsx

import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

// Mude de 'function App' para 'export function App'
export function App() {
  return <RouterProvider router={router} />;
}

