import { prisma } from '../../lib/prisma'

export const getInsignias = async () => {
  return prisma.insignia.findMany({
    include: { requisitos: true },
    orderBy: { nivel: 'asc' },
  })
}

export const getInsigniasEstudiante = async (estudianteId: string) => {
  return prisma.estudianteInsignia.findMany({
    where: { estudianteId },
    include: { insignia: true },
  })
}

export const asignarInsignia = async (data: {
  estudianteId: string
  insigniaId: string
  otorgadaPor: string
}) => {
  return prisma.estudianteInsignia.create({
    data,
    include: { insignia: true },
  })
}

export const revocarInsignia = async (estudianteId: string, insigniaId: string) => {
  return prisma.estudianteInsignia.delete({
    where: {
      estudianteId_insigniaId: { estudianteId, insigniaId },
    },
  })
}

export const getRequisitosEstudiante = async (estudianteId: string) => {
  return prisma.cumplimientoRequisito.findMany({
    where: { estudianteId },
    include: { requisito: { include: { insignia: true } } },
  })
}

export const marcarRequisito = async (data: {
  estudianteId: string
  requisitoId: string
  aprobado: boolean
  aprobadoPor: string
  observaciones?: string
}) => {
  return prisma.cumplimientoRequisito.upsert({
    where: {
      estudianteId_requisitoId: {
        estudianteId: data.estudianteId,
        requisitoId: data.requisitoId,
      },
    },
    update: {
      aprobado: data.aprobado,
      aprobadoPor: data.aprobadoPor,
      fechaAprobacion: data.aprobado ? new Date() : null,
      observaciones: data.observaciones,
    },
    create: {
      estudianteId: data.estudianteId,
      requisitoId: data.requisitoId,
      aprobado: data.aprobado,
      aprobadoPor: data.aprobadoPor,
      fechaAprobacion: data.aprobado ? new Date() : null,
      observaciones: data.observaciones,
    },
  })
}