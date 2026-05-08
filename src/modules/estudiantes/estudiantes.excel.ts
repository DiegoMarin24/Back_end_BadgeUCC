import * as XLSX from 'xlsx'
import { prisma } from '../../lib/prisma'

export const exportarEstudiantes = async () => {
  const [estudiantes, catalogo] = await Promise.all([
    prisma.estudiante.findMany({
      include: {
        programa: true,
        insigniasObtenidas: { include: { insignia: true } },
        actividadesRealizadas: { include: { actividad: true } },
      },
      orderBy: { primerApellido: 'asc' },
    }),
    prisma.catalogoActividad.findMany({ orderBy: { nombre: 'asc' } }),
  ])

  const filas = estudiantes.map((e) => {
    const base: Record<string, any> = {
      'ID Estudiante': e.idEstudiante,
      'Primer Nombre': e.primerNombre,
      'Segundo Nombre': e.segundoNombre ?? '',
      'Primer Apellido': e.primerApellido,
      'Segundo Apellido': e.segundoApellido ?? '',
      'Tipo Documento': e.tipoDocumento,
      'Nro Documento': e.nroDocumento,
      'Lugar Expedición': e.lugarExpedicion,
      'Género': e.genero,
      'Teléfono': e.nroTelefonico ?? '',
      'Correo Institucional': e.correoInstitucional,
      'Programa Académico': e.programa?.nombre ?? '',
      'Nivel Académico': e.nivelAcademico,
      'Insignias Obtenidas': e.insigniasObtenidas.map((i) => i.insignia.nombre).join(', '),
      'Total Puntos': e.actividadesRealizadas.reduce((acc, a) => acc + a.puntosObtenidos, 0),
    }

    // Una columna por cada actividad del catálogo
    for (const actividad of catalogo) {
      const realizada = e.actividadesRealizadas.find(
        (a) => a.actividadId === actividad.id
      )
      base[actividad.nombre] = realizada
        ? new Date(realizada.fechaRegistro).toLocaleDateString('es-CO')
        : 'No'
    }

    return base
  })

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(filas)

  // Ancho de columnas base
  const colsBase = [
    { wch: 15 }, { wch: 15 }, { wch: 15 },
    { wch: 15 }, { wch: 15 }, { wch: 12 },
    { wch: 15 }, { wch: 15 }, { wch: 12 },
    { wch: 14 }, { wch: 25 }, { wch: 22 },
    { wch: 15 }, { wch: 35 }, { wch: 12 },
  ]

  // Ancho para cada columna de actividad
  const colsActividades = catalogo.map(() => ({ wch: 40 }))
  ws['!cols'] = [...colsBase, ...colsActividades]

  // Hoja de catálogo de referencia
  const filasRef = catalogo.map((a) => ({
    'Actividad': a.nombre,
    'Puntos': a.puntos,
    'Acumulable': a.acumulable ? 'Sí' : 'No',
  }))
  const wsRef = XLSX.utils.json_to_sheet(filasRef)
  wsRef['!cols'] = [{ wch: 60 }, { wch: 10 }, { wch: 12 }]

  XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes')
  XLSX.utils.book_append_sheet(wb, wsRef, 'Catálogo Actividades')

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
}

export const importarEstudiantes = async (buffer: Buffer) => {
  const wb = XLSX.read(buffer, { type: 'buffer' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const filas: any[] = XLSX.utils.sheet_to_json(ws)

  const [programas, catalogo] = await Promise.all([
    prisma.programaAcademico.findMany(),
    prisma.catalogoActividad.findMany(),
  ])

  const resultados = { exitosos: 0, errores: 0, detalles: [] as string[] }

  for (const fila of filas) {
    try {
      const nombrePrograma = fila['Programa Académico']?.toString().trim()
      const programa = programas.find(
        (p) => p.nombre.toLowerCase() === nombrePrograma?.toLowerCase()
      )

      if (!programa) {
        resultados.errores++
        resultados.detalles.push(
          `ID ${fila['ID Estudiante']}: Programa "${nombrePrograma}" no encontrado`
        )
        continue
      }

      // Crear o actualizar estudiante
      const estudiante = await prisma.estudiante.upsert({
        where: { idEstudiante: fila['ID Estudiante']?.toString().trim() },
        update: {
          primerNombre: fila['Primer Nombre']?.toString().trim(),
          segundoNombre: fila['Segundo Nombre']?.toString().trim() || null,
          primerApellido: fila['Primer Apellido']?.toString().trim(),
          segundoApellido: fila['Segundo Apellido']?.toString().trim() || null,
          tipoDocumento: fila['Tipo Documento']?.toString().trim(),
          nroDocumento: fila['Nro Documento']?.toString().trim(),
          lugarExpedicion: fila['Lugar Expedición']?.toString().trim(),
          genero: fila['Género']?.toString().trim(),
          nroTelefonico: fila['Teléfono']?.toString().trim() || null,
          correoInstitucional: fila['Correo Institucional']?.toString().trim(),
          programaAcademicoId: programa.id,
          nivelAcademico: fila['Nivel Académico']?.toString().trim(),
        },
        create: {
          idEstudiante: fila['ID Estudiante']?.toString().trim(),
          primerNombre: fila['Primer Nombre']?.toString().trim(),
          segundoNombre: fila['Segundo Nombre']?.toString().trim() || null,
          primerApellido: fila['Primer Apellido']?.toString().trim(),
          segundoApellido: fila['Segundo Apellido']?.toString().trim() || null,
          tipoDocumento: fila['Tipo Documento']?.toString().trim(),
          nroDocumento: fila['Nro Documento']?.toString().trim(),
          lugarExpedicion: fila['Lugar Expedición']?.toString().trim(),
          genero: fila['Género']?.toString().trim(),
          nroTelefonico: fila['Teléfono']?.toString().trim() || null,
          correoInstitucional: fila['Correo Institucional']?.toString().trim(),
          programaAcademicoId: programa.id,
          nivelAcademico: fila['Nivel Académico']?.toString().trim(),
        },
      })

      // Importar actividades — si la columna tiene fecha o "Sí" se registra
      for (const actividad of catalogo) {
        const valorCelda = fila[actividad.nombre]?.toString().trim()
        if (!valorCelda || valorCelda === 'No' || valorCelda === '') continue

        // Verificar si ya existe para no duplicar
        const yaExiste = await prisma.actividadEstudiante.findFirst({
          where: { estudianteId: estudiante.id, actividadId: actividad.id },
        })

        if (!yaExiste) {
          await prisma.actividadEstudiante.create({
            data: {
              estudianteId: estudiante.id,
              actividadId: actividad.id,
              puntosObtenidos: actividad.puntos,
              registradoPor: 'Importación Excel',
              fechaRegistro: new Date(),
            },
          })
        }
      }

      resultados.exitosos++
    } catch (err: any) {
      resultados.errores++
      resultados.detalles.push(`ID ${fila['ID Estudiante']}: ${err.message}`)
    }
  }

  return resultados
}