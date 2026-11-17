require('dotenv').config({ quiet: true })

const express = require('express')
const { conectarMongo } = require('./config/mongodb')
const rotas = require('./routes')
const ErroApi = require('./services/erroApi')

const app = express()
const porta = Number(process.env.PORT || 3000)

app.use(express.json())
app.use(rotas)

app.use((erro, req, res, next) => {
  if (res.headersSent) return next(erro)

  if (erro instanceof ErroApi) {
    return res.status(erro.status).json({ erro: erro.message })
  }

  if (!erro.status || erro.status >= 500) console.error(erro)

  res.status(erro.status || 500).json({
    erro: 'nao foi possivel processar a requisicao'
  })
})

async function iniciar() {
  const cliente = await conectarMongo()

  const servidor = app.listen(porta, () => {
    console.log('servidor rodando em http://localhost:' + porta)
  })

  servidor.on('error', async erro => {
    console.error('Falha ao iniciar o servidor:', erro.message)
    process.exitCode = 1
    await cliente.close()
  })

  function encerrar() {
    servidor.close(async () => {
      await cliente.close()
    })
  }

  process.once('SIGINT', encerrar)
  process.once('SIGTERM', encerrar)
}

iniciar().catch(erro => {
  console.error('Falha ao iniciar a API:', erro.message)
  process.exitCode = 1
})
