import { createBrowserRouter } from "react-router-dom";
import { Home } from "../src/Pages/Home";

import { Notfound } from "./Notfound";
import { Layout } from "../src/Components/Layout";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    
      {
        path: "*",
        element: <Notfound />,
      },
    ],
  },
]);
