import assert from "node:assert/strict";
import test from "node:test";
import {
  CardapioValidationError,
  cardapioParse,
} from "./cardapioDomain.js";

test("normalizes the item name and accepts comma decimals", () => {
  assert.deepEqual(
    cardapioParse({
      nome: "  Suco natural  ",
      preco: "4,50",
      disponivel: false,
    }),
    {
      nome: "Suco natural",
      preco: "4.50",
      disponivel: false,
    },
  );
});

test("defaults new menu items to available", () => {
  assert.equal(
    cardapioParse({ nome: "Cafe", preco: "3.00" }).disponivel,
    true,
  );
});

test("rejects empty names and invalid prices", () => {
  assert.throws(
    () => cardapioParse({ nome: "  ", preco: "3.00" }),
    CardapioValidationError,
  );
  assert.throws(
    () => cardapioParse({ nome: "Cafe", preco: "-1.00" }),
    CardapioValidationError,
  );
  assert.throws(
    () => cardapioParse({ nome: "Cafe", preco: "1.234" }),
    CardapioValidationError,
  );
});
