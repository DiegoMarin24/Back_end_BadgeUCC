import { Router } from 'express'
import {
  getEstudiantes,
  getEstudiante,
  postEstudiante,
  putEstudiante,
  deleteEstudiante,
  getProgramas,
} from './estudiantes.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

const router = Router()

router.use(authMiddleware)

router.get('/', getEstudiantes)
router.get('/programas', getProgramas)
router.get('/:id', getEstudiante)
router.post('/', postEstudiante)
router.put('/:id', putEstudiante)
router.delete('/:id', deleteEstudiante)

export default router