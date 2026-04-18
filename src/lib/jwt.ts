import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'secret'

export const generarToken = (payload: { id: string; rol: string }) => {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' })
}

export const verificarToken = (token: string) => {
  return jwt.verify(token, SECRET) as { id: string; rol: string }
}