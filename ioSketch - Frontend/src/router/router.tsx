import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import DrawingCanvas from "../features/sketch/components/Drawingcanvas";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/sketch",
        element: <DrawingCanvas />
    }
])