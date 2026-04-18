import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/prisma'
import { generarToken } from '../../lib/jwt'

export const loginService = async (email: string, password: string) => {
  const usuario = await prisma.usuario.findUnique({ where: { email } })

  if (!usuario || !usuario.activo) {
    throw new Error('Credenciales inválidas')
  }

  const passwordValido = await bcrypt.compare(password, usuario.password)

  if (!passwordValido) {
    throw new Error('Credenciales inválidas')
  }

  const token = generarToken({ id: usuario.id, rol: usuario.rol })

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
  }
}