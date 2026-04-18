import { Router } from 'express'
import {
  getCatalogoHandler,
  getActividadesEstudianteHandler,
  registrarActividadHandler,
  eliminarActividadHandler,
} from './actividades.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.get('/catalogo', getCatalogoHandler)
router.get('/estudiante/:estudianteId', getActividadesEstudianteHandler)
router.post('/', registrarActividadHandler)
router.delete('/:id', eliminarActividadHandler)

export default router