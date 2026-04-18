import { prisma } from '../../lib/prisma'

export const getCatalogo = async () => {
  return prisma.catalogoActividad.findMany({
    orderBy: { nombre: 'asc' },
  })
}

export const getActividadesEstudiante = async (estudianteId: string) => {
  return prisma.actividadEstudiante.findMany({
    where: { estudianteId },
    include: { actividad: true },
    orderBy: { fechaRegistro: 'desc' },
  })
}

export const registrarActividad = async (data: {
  estudianteId: string
  actividadId: string
  puntosObtenidos: number
  registradoPor: string
  urlCertificado?: string
  observaciones?: string
}) => {
  return prisma.actividadEstudiante.create({
    data,
    include: { actividad: true },
  })
}

export const eliminarActividad = async (id: string) => {
  return prisma.actividadEstudiante.delete({ where: { id } })
}