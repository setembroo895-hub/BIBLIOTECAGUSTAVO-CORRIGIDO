const cadastros = require('../services/cadastrosService')

function criarController(service) {
  return {
    async buscarTodas(req, res) {
      res.json(await service.buscarTodas())
    },

    async buscarPorId(req, res) {
      res.json(await service.buscarPorId(Number(req.params.id)))
    },

    async inserir(req, res) {
      res.status(201).json(await service.inserir(req.body))
    },

    async atualizar(req, res) {
      res.json(await service.atualizar(Number(req.params.id), req.body))
    },

    async remover(req, res) {
      res.json(await service.remover(Number(req.params.id)))
    }
  }
}

module.exports = {
  livros: criarController(cadastros.livros),
  leitores: criarController(cadastros.leitores)
}
