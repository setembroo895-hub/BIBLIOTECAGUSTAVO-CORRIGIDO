const service = require('../services/emprestimoService')

module.exports = {
  async buscarTodas(req, res) {
    res.json(await service.buscarTodas())
  },

  async buscarPorId(req, res) {
    res.json(await service.buscarPorId(Number(req.params.id)))
  },

  async inserir(req, res) {
    res.status(201).json(await service.inserir(req.body))
  },

  async devolver(req, res) {
    res.json(await service.devolver(Number(req.params.id)))
  }
}
