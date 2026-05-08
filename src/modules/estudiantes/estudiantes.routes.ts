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
import { exportarEstudiantes, importarEstudiantes } from './estudiantes.excel'
import multer from 'multer'
import { Request, Response } from 'express'

const upload = multer({ storage: multer.memoryStorage() })
const router = Router()

router.use(authMiddleware)
// Ruta para exportar estudiantes a un archivo Excel
router.get('/exportar', async (_req: Request, res: Response) => {
  try {
    const buffer = await exportarEstudiantes()
    res.setHeader('Content-Disposition', 'attachment; filename="estudiantes_movilidad_ucc.xlsx"')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.send(buffer)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})
// Ruta para importar estudiantes desde un archivo Excel
router.post('/importar', upload.single('archivo'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No se recibió ningún archivo' })
      return
    }
    const resultados = await importarEstudiantes(req.file.buffer)
    res.json(resultados)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/', getEstudiantes)
router.get('/programas', getProgramas)
router.get('/:id', getEstudiante)
router.post('/', postEstudiante)
router.put('/:id', putEstudiante)
router.delete('/:id', deleteEstudiante)

export default router