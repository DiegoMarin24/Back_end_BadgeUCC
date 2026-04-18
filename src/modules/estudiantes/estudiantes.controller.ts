import { Request, Response } from 'express'
import {
  obtenerEstudiantes,
  obtenerEstudiantePorId,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
  obtenerProgramas,
} from './estudiantes.service'

export const getEstudiantes = async (req: Request, res: Response) => {
  try {
    const estudiantes = await obtenerEstudiantes()
    res.json(estudiantes)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getEstudiante = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const estudiante = await obtenerEstudiantePorId(id)
    if (!estudiante) {
      res.status(404).json({ error: 'Estudiante no encontrado' })
      return
    }
    res.json(estudiante)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const postEstudiante = async (req: Request, res: Response) => {
  try {
    const estudiante = await crearEstudiante(req.body)
    res.status(201).json(estudiante)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const putEstudiante = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const estudiante = await actualizarEstudiante(id, req.body)
    res.json(estudiante)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const deleteEstudiante = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    await eliminarEstudiante(id)
    res.json({ message: 'Estudiante eliminado correctamente' })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getProgramas = async (req: Request, res: Response) => {
  try {
    const programas = await obtenerProgramas()
    res.json(programas)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}