import { Router } from 'express'
import {
  getInsigniasHandler,
  getInsigniasEstudianteHandler,
  asignarInsigniaHandler,
  revocarInsigniaHandler,
  getRequisitosEstudianteHandler,
  marcarRequisitoHandler,
} from './insignias.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.get('/', getInsigniasHandler)
router.get('/estudiante/:estudianteId', getInsigniasEstudianteHandler)
router.get('/requisitos/:estudianteId', getRequisitosEstudianteHandler)
router.post('/', asignarInsigniaHandler)
router.post('/requisitos/marcar', marcarRequisitoHandler)
router.delete('/:estudianteId/:insigniaId', revocarInsigniaHandler)

export default router