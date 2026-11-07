function categoriaParse(categoria) {
    const nomeCapitalizado = categoria.nome.charAt(0).toUpperCase() + categoria.nome.slice(1);

    return nomeCapitalizado;
}

export { categoriaParse };