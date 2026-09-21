import express from "express";
export const app = express();

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

import cors from "cors";
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,         
}));

app.use(express.json());

import userRoutes from "./routes/users.route.ts";
app.use("/api/auth", userRoutes);

app.all("/api/auth/{*any}", toNodeHandler(auth));