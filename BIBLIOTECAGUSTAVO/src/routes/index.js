const { Router } = require('express')
const cadastros = require('../controllers/cadastroController')
const emprestimos = require('../controllers/emprestimoController')

const router = Router()

router.get('/', (req, res) => {
  res.json({ mensagem: 'api da biblioteca' })
})

function rotasCadastro(controller) {
  const rotas = Router()

  rotas.get('/', controller.buscarTodas)
  rotas.get('/:id', controller.buscarPorId)
  rotas.post('/', controller.inserir)
  rotas.put('/:id', controller.atualizar)
  rotas.delete('/:id', controller.remover)

  return rotas
}

router.use('/livros', rotasCadastro(cadastros.livros))
router.use('/leitores', rotasCadastro(cadastros.leitores))

router.get('/emprestimos', emprestimos.buscarTodas)
router.get('/emprestimos/:id', emprestimos.buscarPorId)
router.post('/emprestimos', emprestimos.inserir)
router.put('/emprestimos/:id/devolucao', emprestimos.devolver)

module.exports = router
