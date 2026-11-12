import express from "express";
import cors from "cors";
import categoriaRouter from "./controllers/categoriaController.js";
import fiadoRouter from "./controllers/fiadoController.js";

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use("/categorias", categoriaRouter);
app.use("/fiados", fiadoRouter);

app.listen(3000, () => {
    console.log("Server running");
});