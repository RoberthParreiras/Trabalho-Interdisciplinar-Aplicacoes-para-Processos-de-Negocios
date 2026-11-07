import express from "express";
import categoriaRouter from "./controllers/categoriaController.js"

const app = express();

app.use(express.json());

app.use("/categorias", categoriaRouter);

app.listen(3000, () => {
    console.log("Server running");
});