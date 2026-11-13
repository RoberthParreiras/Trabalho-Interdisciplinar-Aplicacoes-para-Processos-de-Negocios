import express from "express";
import categoriaRouter from "./controllers/categoriaController.js";
import estoqueRouter from "./controllers/estoqueController.js";

const app = express();

app.use(express.json());

app.use("/categorias", categoriaRouter);
app.use("/estoques", estoqueRouter);

app.listen(3000, () => {
    console.log("Server running");
});