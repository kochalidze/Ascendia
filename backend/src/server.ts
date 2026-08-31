import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();
const port = 8000;

app.all("/api/auth/{*any}", toNodeHandler(auth));

// Mount body-parsing middleware after the Better Auth handler.
app.use(express.json());

app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});