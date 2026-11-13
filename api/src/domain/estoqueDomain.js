function estoqueParse(estoque) {
    const nomeCapitalizado = estoque.nome.charAt(0).toUpperCase() + estoque.nome.slice(1);
    return {
        ...estoque,
        nome: nomeCapitalizado
    };
}

export { estoqueParse };
