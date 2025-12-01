import { createBrowserRouter } from "react-router-dom";
import { Home } from "./Pages/Home";
import { Detail } from "./Pages/Detail";
import { Notfound } from "./Notfound";

const router = createBrowserRouter([
  {
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
      }
    ],
  },
]);

export default router;
