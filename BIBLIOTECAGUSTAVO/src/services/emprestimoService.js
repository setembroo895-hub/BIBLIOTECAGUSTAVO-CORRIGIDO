const livroModel = require('../models/livroModel')
const leitorModel = require('../models/leitorModel')
const emprestimoModel = require('../models/emprestimoModel')
const ErroApi = require('./erroApi')
const executarEmOrdem = require('./executarEmOrdem')

async function buscarPorId(id) {
  const emprestimo = await emprestimoModel.buscarPorId(id)
  if (!emprestimo) throw new ErroApi(404, 'emprestimo nao encontrado')
  return emprestimo
}

function inserir(dados) {
  const livro_id = Number(dados?.livro_id)
  const leitor_id = Number(dados?.leitor_id)

  return executarEmOrdem(async () => {
    const [livro, leitor] = await Promise.all([
      livroModel.buscarPorId(livro_id),
      leitorModel.buscarPorId(leitor_id)
    ])

    if (!livro || !leitor) {
      throw new ErroApi(400, 'livro ou leitor nao encontrado')
    }

    const ativos = await emprestimoModel.buscarTodas({ livro_id, devolvido: false })
    if (ativos.length > 0) {
      throw new ErroApi(400, 'o livro ja esta emprestado')
    }

    try {
      return await emprestimoModel.inserir({ livro_id, leitor_id, devolvido: false })
    } catch (erro) {
      if (erro.code === 11000 && erro.keyPattern?.livro_id === 1) {
        throw new ErroApi(400, 'o livro ja esta emprestado')
      }

      throw erro
    }
  })
}

function devolver(id) {
  return executarEmOrdem(async () => {
    const emprestimo = await emprestimoModel.atualizar(
      id,
      { devolvido: true },
      { devolvido: false }
    )

    if (emprestimo) return emprestimo

    await buscarPorId(id)
    throw new ErroApi(400, 'o livro ja foi devolvido')
  })
}

module.exports = {
  buscarTodas: () => emprestimoModel.buscarTodas(),
  buscarPorId,
  inserir,
  devolver
}
