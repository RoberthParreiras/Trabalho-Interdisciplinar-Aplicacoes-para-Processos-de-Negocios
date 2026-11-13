import assert from "node:assert/strict";
import test from "node:test";
import { ErroValidacaoEstoque, validarQuantidadeEstoque } from "./estoqueDomain.js";

test("aceita quantidade zero e inteiros positivos", () => {
    assert.equal(validarQuantidadeEstoque(0), 0);
    assert.equal(validarQuantidadeEstoque(12), 12);
});

test("rejeita quantidade negativa, fracionada ou que não seja número", () => {
    for (const quantidade of [-1, 1.5, "2", null, undefined, NaN]) {
        assert.throws(
            () => validarQuantidadeEstoque(quantidade),
            ErroValidacaoEstoque
        );
    }
});
