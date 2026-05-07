import { Router, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { authMiddleware } from '../../middlewares/auth.middleware'

const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const nombre = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`
    cb(null, nombre)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const permitidos = ['.pdf', '.jpg', '.jpeg', '.png']
    const ext = path.extname(file.originalname).toLowerCase()
    if (permitidos.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten archivos PDF, JPG o PNG'))
    }
  },
})

const router = Router()

router.use(authMiddleware)

router.post('/', upload.single('archivo'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No se recibió ningún archivo' })
    return
  }
  const url = `http://localhost:3000/uploads/${req.file.filename}`
  res.json({ url, nombre: req.file.originalname, tamanio: req.file.size })
})

export default router