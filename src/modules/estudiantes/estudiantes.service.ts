import { prisma } from '../../lib/prisma'

export const obtenerEstudiantes = async () => {
  return prisma.estudiante.findMany({
    include: {
      programa: true,
      insigniasObtenidas: { include: { insignia: true } },
    },
    orderBy: { primerApellido: 'asc' },
  })
}

export const obtenerEstudiantePorId = async (id: string) => {
  return prisma.estudiante.findUnique({
    where: { id },
    include: {
      programa: true,
      insigniasObtenidas: { include: { insignia: true } },
      cumplimientoRequisitos: { include: { requisito: true } },
      actividadesRealizadas: { include: { actividad: true } },
    },
  })
}

export const crearEstudiante = async (data: {
  programaAcademicoId: string
  nivelAcademico: string
  idEstudiante: string
  tipoDocumento: string
  nroDocumento: string
  lugarExpedicion: string
  primerApellido: string
  segundoApellido?: string
  primerNombre: string
  segundoNombre?: string
  genero: string
  nroTelefonico?: string
  correoInstitucional: string
}) => {
  return prisma.estudiante.create({ data })
}

export const actualizarEstudiante = async (id: string, data: Partial<{
  programaAcademicoId: string
  nivelAcademico: string
  tipoDocumento: string
  nroDocumento: string
  lugarExpedicion: string
  primerApellido: string
  segundoApellido: string
  primerNombre: string
  segundoNombre: string
  genero: string
  nroTelefonico: string
  correoInstitucional: string
}>) => {
  return prisma.estudiante.update({ where: { id }, data })
}

export const eliminarEstudiante = async (id: string) => {
  return prisma.estudiante.delete({ where: { id } })
}

export const obtenerProgramas = async () => {
  return prisma.programaAcademico.findMany({
    orderBy: { nombre: 'asc' },
  })
}