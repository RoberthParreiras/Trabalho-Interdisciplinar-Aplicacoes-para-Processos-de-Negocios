import express from "express";
import categoriaRouter from "./controllers/categoriaController.js";
import fiadoRouter from "./controllers/fiadoController.js";

const app = express();

app.use(express.json());

app.use("/categorias", categoriaRouter);
app.use("/fiados", fiadoRouter);

app.listen(3000, () => {
    console.log("Server running");
});