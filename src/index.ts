import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './modules/auth/auth.routes'
import estudiantesRoutes from './modules/estudiantes/estudiantes.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/estudiantes', estudiantesRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API Movilidad UCC funcionando correctamente' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})