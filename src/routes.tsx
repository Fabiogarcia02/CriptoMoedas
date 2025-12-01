import { createBrowserRouter } from "react-router-dom";
import { Home } from "./Pages/Home";
import { Detail } from "./Pages/Detail";
import { Notfound } from "./Notfound";
import { Layout } from "./Components/Layout";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/Detail/:cripto",
        element: <Detail />,
      },
      {
        path: "*",
        element: <Notfound />,
      },
    ],
  },
]);
