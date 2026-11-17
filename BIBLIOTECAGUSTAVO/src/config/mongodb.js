const { MongoClient } = require('mongodb')

let banco

async function conectarMongo() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
  const nome = process.env.MONGODB_DATABASE || 'biblioteca'
  const cliente = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 })

  try {
    await cliente.connect()
    const conexao = cliente.db(nome)

    await conexao.collection('emprestimos').createIndex(
      { livro_id: 1 },
      {
        name: 'um_emprestimo_ativo_por_livro',
        unique: true,
        partialFilterExpression: { devolvido: false }
      }
    )

    banco = conexao
    return cliente
  } catch (erro) {
    await cliente.close()
    throw erro
  }
}

function colecao(nome) {
  return banco.collection(nome)
}

module.exports = { conectarMongo, colecao }
