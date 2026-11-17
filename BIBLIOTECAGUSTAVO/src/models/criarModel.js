const { colecao } = require('../config/mongodb')

function paraResposta(documento) {
  if (!documento) return null

  const { _id, ...dados } = documento
  return { id: _id, ...dados }
}

function criarModel(nome) {
  return {
    async inserir(dados) {
      const contador = await colecao('contadores').findOneAndUpdate(
        { _id: nome },
        { $inc: { ultimoId: 1 } },
        { upsert: true, returnDocument: 'after' }
      )

      const documento = { ...dados, _id: contador.ultimoId }
      await colecao(nome).insertOne(documento)
      return paraResposta(documento)
    },

    async buscarTodas(filtro = {}) {
      const documentos = await colecao(nome).find(filtro).sort({ _id: 1 }).toArray()
      return documentos.map(paraResposta)
    },

    async buscarPorId(id) {
      const documento = await colecao(nome).findOne({ _id: id })
      return paraResposta(documento)
    },

    async atualizar(id, dados, condicao = {}) {
      const documento = await colecao(nome).findOneAndUpdate(
        { ...condicao, _id: id },
        { $set: dados },
        { returnDocument: 'after' }
      )

      return paraResposta(documento)
    },

    async remover(id) {
      const resultado = await colecao(nome).deleteOne({ _id: id })
      return resultado.deletedCount === 1
    }
  }
}

module.exports = criarModel
