import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";
import Homepage from "./pages/home/homepage";
import ShowPage from "./pages/show/show-page";
import Header from "./components/nav/header";

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