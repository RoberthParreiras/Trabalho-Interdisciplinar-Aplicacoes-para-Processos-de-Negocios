import express from "express";
import categoriaRouter from "./controllers/categoriaController.js";
import fiadoRouter from "./controllers/fiadoController.js";
import itemComandaRouter from "./controllers/itemComandaController.js";

const app = express();

app.use(express.json());

app.use("/categorias", categoriaRouter);
app.use("/fiados", fiadoRouter);
app.use("/itens-comanda", itemComandaRouter);

app.listen(3000, () => {
    console.log("Server running");
});