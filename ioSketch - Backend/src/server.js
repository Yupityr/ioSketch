import express from "express";
import { config } from "dotenv";
import dotenv from "dotenv";
import "dotenv/config"; 
import { connectDB, disconnectDB } from "./config/db.js";

//Import Routes
import sketchRoutes from "./routes/sketchRoutes.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config();
const startServer = async () => {
    try {
        await connectDB();

        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.use("/sketch", sketchRoutes);
        app.use("/auth", authRoutes);

        app.get("/", (req, res) => {
            res.json({ message: "Hello World" });
        });

        const server = app.listen(process.env.PORT || 5001, "0.0.0.0", () => {
        console.log(`Server running on PORT ${process.env.PORT}`);
        });
        

        process.on("unhandledRejection", async (err) => {
            console.error("Unhandled Rejection:", err);
            server.close(async () => {
                await disconnectDB();
                process.exit(1);
            });
        });

        process.on("uncaughtException", async (err) => {
            console.error("Uncaught Exception:", err);
            await disconnectDB();
            process.exit(1);
        });

        process.on("SIGTERM", async () => {
            console.log("SIGTERM received, shutting down gracefully");
            server.close(async () => {
                await disconnectDB();
                process.exit(0);
            });
        });

    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer();

// const app = express();

// //parsing middleware
// app.use(express.json());
// app.use(express.urlencoded({extended:true}))

// //API Routes
// app.use("/sketch", sketchRoutes)
// app.use("/auth", authRoutes)

// app.get('/', (req, res) => {
//     res.json({message: "Hello World"})
// });

// const PORT = 5000;
// const server = app.listen(PORT, () => {
//     console.log(`Server running on PORT ${PORT}`);    
// });

// process.on("unhandledRejection", (err) => {
//     console.error("Unhandled Rejection:", err);
//     server.close(async () => { 
//         await disconnectDB();
//         process.exit(1);
//     });
// });

// process.on("uncaughtException", async (err) => {
//     console.error("Uncaught Exception:", err);
//     await disconnectDB();
//     process.exit(1);
// });

// process.on("SIGTERM", async() => {
//     console.log("SIGTERM received, shutting down gracefully");
//     server.close(async () => {
//         await disconnectDB();
//         process.exit(0);
//     });
// });