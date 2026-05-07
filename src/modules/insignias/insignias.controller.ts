import { Request, Response } from 'express'
import {
  getInsignias,
  getInsigniasEstudiante,
  asignarInsignia,
  revocarInsignia,
  getRequisitosEstudiante,
  marcarRequisito,
} from './insignias.service'

export const getInsigniasHandler = async (req: Request, res: Response) => {
  try {
    const insignias = await getInsignias()
    res.json(insignias)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getInsigniasEstudianteHandler = async (req: Request, res: Response) => {
  try {
    const { estudianteId } = req.params
    const insignias = await getInsigniasEstudiante(estudianteId as string)
    res.json(insignias)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const asignarInsigniaHandler = async (req: Request, res: Response) => {
  try {
    const insignia = await asignarInsignia(req.body)
    res.status(201).json(insignia)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const revocarInsigniaHandler = async (req: Request, res: Response) => {
  try {
    const { estudianteId, insigniaId } = req.params
    await revocarInsignia(estudianteId as string, insigniaId as string)
    res.json({ message: 'Insignia revocada correctamente' })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getRequisitosEstudianteHandler = async (req: Request, res: Response) => {
  try {
    const { estudianteId } = req.params
    const requisitos = await getRequisitosEstudiante(estudianteId as string)
    res.json(requisitos)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const marcarRequisitoHandler = async (req: Request, res: Response) => {
  try {
    const requisito = await marcarRequisito(req.body)
    res.json(requisito)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}