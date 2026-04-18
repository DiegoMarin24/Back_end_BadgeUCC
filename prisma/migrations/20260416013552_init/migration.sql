-- CreateEnum
CREATE TYPE "TipoRequisito" AS ENUM ('SEMESTRES_APROBADOS', 'CURSO_APROBADO', 'CREDITOS_PORCENTAJE', 'PUNTOS_ACTIVIDADES', 'INSIGNIA_PREVIA');

-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'COORDINADOR');

-- CreateTable
CREATE TABLE "programas_academicos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "aplicaInsignias" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "programas_academicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estudiantes" (
    "id" TEXT NOT NULL,
    "programaAcademicoId" TEXT NOT NULL,
    "nivelAcademico" TEXT NOT NULL,
    "idEstudiante" TEXT NOT NULL,
    "tipoDocumento" TEXT NOT NULL,
    "nroDocumento" TEXT NOT NULL,
    "lugarExpedicion" TEXT NOT NULL,
    "primerApellido" TEXT NOT NULL,
    "segundoApellido" TEXT,
    "primerNombre" TEXT NOT NULL,
    "segundoNombre" TEXT,
    "genero" TEXT NOT NULL,
    "nroTelefonico" TEXT,
    "correoInstitucional" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insignias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "nivel" INTEGER NOT NULL,
    "imagenUrl" TEXT,

    CONSTRAINT "insignias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estudiante_insignias" (
    "id" TEXT NOT NULL,
    "estudianteId" TEXT NOT NULL,
    "insigniaId" TEXT NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "otorgadaPor" TEXT NOT NULL,

    CONSTRAINT "estudiante_insignias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requisitos_insignia" (
    "id" TEXT NOT NULL,
    "insigniaId" TEXT NOT NULL,
    "tipo" "TipoRequisito" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "esObligatorio" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "requisitos_insignia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cumplimiento_requisitos" (
    "id" TEXT NOT NULL,
    "estudianteId" TEXT NOT NULL,
    "requisitoId" TEXT NOT NULL,
    "aprobado" BOOLEAN NOT NULL DEFAULT false,
    "fechaAprobacion" TIMESTAMP(3),
    "aprobadoPor" TEXT,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cumplimiento_requisitos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogo_actividades" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "puntos" INTEGER NOT NULL,
    "descripcion" TEXT,
    "acumulable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "catalogo_actividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividades_estudiante" (
    "id" TEXT NOT NULL,
    "estudianteId" TEXT NOT NULL,
    "actividadId" TEXT NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registradoPor" TEXT NOT NULL,
    "urlCertificado" TEXT,
    "puntosObtenidos" INTEGER NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "actividades_estudiante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'COORDINADOR',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "programas_academicos_nombre_key" ON "programas_academicos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_idEstudiante_key" ON "estudiantes"("idEstudiante");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_nroDocumento_key" ON "estudiantes"("nroDocumento");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_correoInstitucional_key" ON "estudiantes"("correoInstitucional");

-- CreateIndex
CREATE UNIQUE INDEX "insignias_nombre_key" ON "insignias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "estudiante_insignias_estudianteId_insigniaId_key" ON "estudiante_insignias"("estudianteId", "insigniaId");

-- CreateIndex
CREATE UNIQUE INDEX "cumplimiento_requisitos_estudianteId_requisitoId_key" ON "cumplimiento_requisitos"("estudianteId", "requisitoId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "estudiantes" ADD CONSTRAINT "estudiantes_programaAcademicoId_fkey" FOREIGN KEY ("programaAcademicoId") REFERENCES "programas_academicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiante_insignias" ADD CONSTRAINT "estudiante_insignias_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "estudiantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiante_insignias" ADD CONSTRAINT "estudiante_insignias_insigniaId_fkey" FOREIGN KEY ("insigniaId") REFERENCES "insignias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisitos_insignia" ADD CONSTRAINT "requisitos_insignia_insigniaId_fkey" FOREIGN KEY ("insigniaId") REFERENCES "insignias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cumplimiento_requisitos" ADD CONSTRAINT "cumplimiento_requisitos_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "estudiantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cumplimiento_requisitos" ADD CONSTRAINT "cumplimiento_requisitos_requisitoId_fkey" FOREIGN KEY ("requisitoId") REFERENCES "requisitos_insignia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades_estudiante" ADD CONSTRAINT "actividades_estudiante_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "estudiantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades_estudiante" ADD CONSTRAINT "actividades_estudiante_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "catalogo_actividades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
