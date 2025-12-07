import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import "./App.css"; 

// 1. Coloque o 'export' direto na função
export function App() {
  return <RouterProvider router={router} />;
}

// 2. Apague a linha 'export default App;' do final se ela existir!