import { createBrowserRouter } from "react-router-dom";
import { Home } from "./Pages/Home";     // Confirme se o caminho da pasta está certo
import { Detail } from "./Pages/Detail"; // <--- Importante: Importe a página de Detalhes
import { Layout } from "./Components/Layout";
import { Notfound } from "./Notfound";
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      // ADICIONE ESTA ROTA ABAIXO:
      {
        path: "/detail/:cripto", 
        element: <Detail />,
      },
      {
        path: "*",
        element: <Notfound />,
      },
    ],
  },
]);

export { router };