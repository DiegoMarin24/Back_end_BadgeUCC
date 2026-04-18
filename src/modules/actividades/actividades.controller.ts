import { Request, Response } from 'express'
import {
  getCatalogo,
  getActividadesEstudiante,
  registrarActividad,
  eliminarActividad,
} from './actividades.service'

export const getCatalogoHandler = async (req: Request, res: Response) => {
  try {
    const catalogo = await getCatalogo()
    res.json(catalogo)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getActividadesEstudianteHandler = async (req: Request, res: Response) => {
  try {
    const { estudianteId } = req.params
    const actividades = await getActividadesEstudiante(estudianteId as string)
    res.json(actividades)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const registrarActividadHandler = async (req: Request, res: Response) => {
  try {
    const actividad = await registrarActividad(req.body)
    res.status(201).json(actividad)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const eliminarActividadHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await eliminarActividad(id as string)
    res.json({ message: 'Actividad eliminada correctamente' })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}