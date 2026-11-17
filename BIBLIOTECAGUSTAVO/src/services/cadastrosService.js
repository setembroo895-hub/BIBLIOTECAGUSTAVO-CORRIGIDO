const livroModel = require('../models/livroModel')
const leitorModel = require('../models/leitorModel')
const emprestimoModel = require('../models/emprestimoModel')
const ErroApi = require('./erroApi')
const executarEmOrdem = require('./executarEmOrdem')

function criarService(model, entidade, campos, mensagemValidacao) {
  const mensagemNaoEncontrado = entidade + ' nao encontrado'

  function validar(dados) {
    for (const campo of campos) {
      if (typeof dados?.[campo] !== 'string' || !dados[campo].trim()) {
        throw new ErroApi(400, mensagemValidacao)
      }
    }

    return Object.fromEntries(campos.map(campo => [campo, dados[campo].trim()]))
  }

  async function buscarPorId(id) {
    const registro = await model.buscarPorId(id)
    if (!registro) throw new ErroApi(404, mensagemNaoEncontrado)
    return registro
  }

  return {
    buscarTodas: () => model.buscarTodas(),
    buscarPorId,

    inserir(dados) {
      return model.inserir(validar(dados))
    },

    async atualizar(id, dados) {
      await buscarPorId(id)
      const registro = await model.atualizar(id, validar(dados))
      if (!registro) throw new ErroApi(404, mensagemNaoEncontrado)
      return registro
    },

    remover(id) {
      return executarEmOrdem(async () => {
        await buscarPorId(id)

        const pendentes = await emprestimoModel.buscarTodas({
          [entidade + '_id']: id,
          devolvido: false
        })

        if (pendentes.length > 0) {
          throw new ErroApi(400, 'existe um emprestimo pendente')
        }

        if (!(await model.remover(id))) {
          throw new ErroApi(404, mensagemNaoEncontrado)
        }

        return { mensagem: entidade + ' excluido' }
      })
    }
  }
}

module.exports = {
  livros: criarService(livroModel, 'livro', ['titulo', 'autor'], 'informe titulo e autor'),
  leitores: criarService(leitorModel, 'leitor', ['nome', 'email'], 'informe nome e email')
}
