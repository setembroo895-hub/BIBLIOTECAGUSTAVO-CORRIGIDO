let ultimaOperacao = Promise.resolve()

function executarEmOrdem(operacao) {
  const resultado = ultimaOperacao.then(operacao)
  ultimaOperacao = resultado.catch(() => {})
  return resultado
}

module.exports = executarEmOrdem
