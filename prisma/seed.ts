// prisma/seed.ts
// Datos iniciales: programas, insignias, requisitos y catálogo de actividades

import { PrismaClient, TipoRequisito } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Sembrando base de datos...')

  // ── 1. PROGRAMAS ACADÉMICOS ──────────────────────────────────────────
  const programas = await Promise.all([
    'Psicología',
    'Derecho',
    'Diseño Crossmedia',
    'Ingeniería de Sistemas',
    'Ingeniería Industrial',
    'Ingeniería Civil',
  ].map(nombre =>
    prisma.programaAcademico.upsert({
      where: { nombre },
      update: {},
      create: { nombre, aplicaInsignias: true },
    })
  ))
  console.log(`✓ ${programas.length} programas académicos`)

  // ── 2. CATÁLOGO DE ACTIVIDADES (Ruta Global) ─────────────────────────
  const actividades = [
    { nombre: 'Institucional II',                                                      puntos: 10, acumulable: false },
    { nombre: 'Institucional III',                                                     puntos: 10, acumulable: false },
    { nombre: 'Cursar y aprobar un semestre académico en el extranjero',               puntos: 20, acumulable: false },
    { nombre: 'Participar en un curso de movilidad virtual (nacional o internacional)',puntos:  5, acumulable: true  },
    { nombre: 'Certificación de participación en evento académico internacional (mín. 20 h)', puntos: 5, acumulable: false },
    { nombre: 'Participar en una clase Espejo',                                        puntos: 10, acumulable: false },
    { nombre: 'Certificar Voluntariado (mínimo 30 horas)',                             puntos: 15, acumulable: false },
    { nombre: 'Certificar segundo idioma (B1)',                                        puntos: 10, acumulable: false },
    { nombre: 'Certificar segundo idioma (B2)',                                        puntos: 20, acumulable: false },
    { nombre: 'Participar en Global Festival (mín. 4 horas por evento)',               puntos:  5, acumulable: true  },
    { nombre: 'Participar en Semillero de investigación / proyecto internacional',     puntos: 10, acumulable: false },
    { nombre: 'Realizar movilidad nacional multicampus presencial (un semestre)',      puntos: 10, acumulable: false },
    { nombre: 'Estancia académica corta en el extranjero',                             puntos: 15, acumulable: false },
    { nombre: 'Misión académica internacional',                                        puntos: 15, acumulable: false },
    { nombre: 'Trabajo en campamentos de verano con personas con discapacidad (CCUSA)',puntos: 20, acumulable: false },
    { nombre: 'Pasantía investigativa en institución extranjera (mínimo un mes)',      puntos: 15, acumulable: false },
    { nombre: 'Prácticas profesionales en el extranjero (mínimo 3 meses)',             puntos: 20, acumulable: false },
  ]

  for (const act of actividades) {
    await prisma.catalogoActividad.upsert({
      where: { nombre: act.nombre } as any,
      update: { puntos: act.puntos, acumulable: act.acumulable },
      create: act,
    })
  }
  console.log(`✓ ${actividades.length} actividades en el catálogo`)

  // ── 3. INSIGNIAS Y REQUISITOS ────────────────────────────────────────

  // INSIGNIA 1: Pasajero Internacional
  const insignia1 = await prisma.insignia.upsert({
    where: { nombre: 'Pasajero Internacional' },
    update: {},
    create: {
      nombre: 'Pasajero Internacional',
      descripcion: 'Primera insignia de la ruta global UCC.',
      nivel: 1,
    },
  })
  await prisma.requisitoInsignia.createMany({
    skipDuplicates: true,
    data: [
      {
        insigniaId: insignia1.id,
        tipo: TipoRequisito.SEMESTRES_APROBADOS,
        descripcion: 'Aprobar mínimo dos semestres académicos',
        esObligatorio: true,
      },
      {
        insigniaId: insignia1.id,
        tipo: TipoRequisito.CURSO_APROBADO,
        descripcion: 'Completar y aprobar el curso Inglés 1',
        esObligatorio: true,
      },
    ],
  })

  // INSIGNIA 2: Estudiante Global
  const insignia2 = await prisma.insignia.upsert({
    where: { nombre: 'Estudiante Global' },
    update: {},
    create: {
      nombre: 'Estudiante Global',
      descripcion: 'Segunda insignia — formación humanística e institucional.',
      nivel: 2,
    },
  })
  await prisma.requisitoInsignia.createMany({
    skipDuplicates: true,
    data: [
      {
        insigniaId: insignia2.id,
        tipo: TipoRequisito.CURSO_APROBADO,
        descripcion: 'Aprobar Humanidades 1, Humanidades 2 y Humanidades 3',
        esObligatorio: true,
      },
      {
        insigniaId: insignia2.id,
        tipo: TipoRequisito.CURSO_APROBADO,
        descripcion: 'Aprobar Institucionales 1',
        esObligatorio: true,
      },
      {
        insigniaId: insignia2.id,
        tipo: TipoRequisito.CURSO_APROBADO,
        descripcion: 'Aprobar Problemas Sociales Globales o curso equivalente',
        esObligatorio: true,
      },
    ],
  })

  // INSIGNIA 3: Ciudadano Mundial
  const insignia3 = await prisma.insignia.upsert({
    where: { nombre: 'Ciudadano Mundial' },
    update: {},
    create: {
      nombre: 'Ciudadano Mundial',
      descripcion: 'Insignia máxima — requiere trayectoria global certificada.',
      nivel: 3,
    },
  })
  await prisma.requisitoInsignia.createMany({
    skipDuplicates: true,
    data: [
      {
        insigniaId: insignia3.id,
        tipo: TipoRequisito.INSIGNIA_PREVIA,
        descripcion: 'Haber obtenido la insignia Estudiante Global',
        esObligatorio: true,
      },
      {
        insigniaId: insignia3.id,
        tipo: TipoRequisito.CREDITOS_PORCENTAJE,
        descripcion: 'Llevar el 60% de créditos del programa aprobados',
        esObligatorio: true,
      },
      {
        insigniaId: insignia3.id,
        tipo: TipoRequisito.PUNTOS_ACTIVIDADES,
        descripcion: 'Sumar mínimo 70 puntos en actividades certificadas de la Ruta Global',
        esObligatorio: true,
      },
    ],
  })
  console.log('✓ 3 insignias con sus requisitos')

  // ── 4. USUARIO ADMINISTRADOR INICIAL ────────────────────────────────
  const passHash = await bcrypt.hash('Admin123!', 10)
  await prisma.usuario.upsert({
    where: { email: 'admin@ucc.edu.co' },
    update: {},
    create: {
      nombre: 'Administrador UCC',
      email: 'admin@ucc.edu.co',
      password: passHash,
      rol: 'ADMIN',
    },
  })
  console.log('✓ Usuario admin creado (admin@ucc.edu.co / Admin123!)')

  console.log('\nSeed completado exitosamente.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
