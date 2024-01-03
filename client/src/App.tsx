import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";
import Header from "./components/nav/header";
import ShowPage from "./components/pages/show/show-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Header /><Outlet /></>,
    children: [
      {
        index: true,
        element: <Homepage />
      },
      {
        path: "*",
        element: <ShowPage />
      }
    ]
  },
]);

const queryClient = new QueryClient();

export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}