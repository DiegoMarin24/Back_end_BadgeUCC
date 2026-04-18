import { Request, Response } from 'express'
import { loginService } from './auth.service'

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ error: 'Email y contraseña son requeridos' })
    return
  }

  try {
    const resultado = await loginService(email, password)
    res.json(resultado)
  } catch (error: any) {
    res.status(401).json({ error: error.message })
  }
}