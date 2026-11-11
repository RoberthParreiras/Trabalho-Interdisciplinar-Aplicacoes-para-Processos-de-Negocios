function fiadoParse(fiado) {
    if (!validarCPF(fiado.cpf)) throw "CPF inválido";

    return fiado;
}

function validarCPF(cpf) {
  const limpo = String(cpf).replace(/\D/g, '');

  if (limpo.length !== 11) {
    return false;
  }

  // Elimina sequências com todos os dígitos iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(limpo)) {
    return false;
  }

  // Cálculo do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(limpo.charAt(i), 10) * (10 - i);
  }

  let resto = (soma * 10) % 11;
  const digito1 = (resto === 10 || resto === 11) ? 0 : resto;

  if (digito1 !== parseInt(limpo.charAt(9), 10)) {
    return false;
  }

  // Cálculo do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(limpo.charAt(i), 10) * (11 - i);
  }
  
  resto = (soma * 10) % 11;
  const digito2 = (resto === 10 || resto === 11) ? 0 : resto;

  return digito2 === parseInt(limpo.charAt(10), 10);
}

export { fiadoParse };