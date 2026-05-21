import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import DrawingCanvas from "../features/sketch/components/Drawingcanvas";
import Homelayout from "../pages/Homelayout";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Homelayout />,
        children:[
            {index: true, element: <Home/>},
        ]
    },
    {
        path: "/sketch",
        element: <DrawingCanvas />
    }
])