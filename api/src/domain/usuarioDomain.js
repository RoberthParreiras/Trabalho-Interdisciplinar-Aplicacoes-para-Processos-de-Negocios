function usuarioParse(usuario) {
    if (!usuario.nome) {
        throw "Nome do usuário é obrigatório";
    }

    if (!usuario.usuario) {
        throw "Usuário é obrigatório";
    }

    if (!usuario.senha) {
        throw "Senha é obrigatória";
    }

    return {
        nome: usuario.nome.trim(),
        usuario: usuario.usuario.trim(),
        senha: usuario.senha
    };
}

export { usuarioParse };