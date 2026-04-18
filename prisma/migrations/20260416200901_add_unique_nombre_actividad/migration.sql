/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `catalogo_actividades` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "catalogo_actividades_nombre_key" ON "catalogo_actividades"("nombre");
