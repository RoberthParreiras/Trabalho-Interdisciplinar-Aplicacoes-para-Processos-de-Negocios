import express from "express";
import categoriaRouter from "./controllers/categoriaController.js";
import estoqueRouter from "./controllers/estoqueController.js";
import { ErroValidacaoEstoque } from "./domain/estoqueDomain.js";

const app = express();

app.use(express.json());

app.use("/categorias", categoriaRouter);
app.use("/estoques", estoqueRouter);

app.use((erro, req, res, next) => {
    if (erro instanceof ErroValidacaoEstoque) {
        return res.status(400).json({ erro: erro.message });
    }

    next(erro);
});

app.listen(3000, () => {
    console.log("Server running");
});