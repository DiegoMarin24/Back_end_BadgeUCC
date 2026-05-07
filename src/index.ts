import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './modules/auth/auth.routes'
import estudiantesRoutes from './modules/estudiantes/estudiantes.routes'
import actividadesRoutes from './modules/actividades/actividades.routes'
import insigniasRoutes from './modules/insignias/insignias.routes'
import archivosRoutes from './modules/archivos/archivos.routes'
import path from 'path/win32'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
// Servir archivos estáticos — debe ir antes de las rutas
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/estudiantes', estudiantesRoutes)
app.use('/api/actividades', actividadesRoutes)
app.use('/api/insignias', insigniasRoutes)
app.use('/api/archivos', archivosRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API Movilidad UCC funcionando correctamente' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})