import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import categoriaRouter from "./controllers/categoriaController.js";
import fiadoRouter from "./controllers/fiadoController.js";
import estoqueRouter from "./controllers/estoqueController.js";
import usuarioRouter from "./controllers/usuarioController.js";
import itemComandaRouter from "./controllers/itemComandaController.js";


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  }),
);

app.use("/categorias", categoriaRouter);
app.use("/fiados", fiadoRouter);
app.use("/estoques", estoqueRouter);
app.use("/usuarios", usuarioRouter);
app.use("/itens-comanda", itemComandaRouter);

app.listen(3000, () => {
  console.log("Server running");
});
