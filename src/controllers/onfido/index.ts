import { Request, Response } from 'express'

import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const baseUrl = process.env.BASE_URL
const apiToken = process.env.API_TOKEN
const workflowId = process.env.WORKFLOW_ID

const a = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Token token=${apiToken}`,
    "Content-Type": 'application/json',
    Accept: 'application/json'
  }
})

export const createUser = async (req: Request, res: Response) => {
  try {
    const creation = await a.post(
      '/applicants',
      JSON.stringify({
        first_name: new Date().getTime(),
        last_name: Math.floor(Math.random() * 1000) + 1
      })
    )

    res.status(200).json({
      success: true,
      userId: creation.data.id
    })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

export const getSDKToken = async (req: Request, res: Response) => {
  const userId = req.body.applicant_id

  if (userId && userId.trim() !== '') {
    try {
      const info = await a.post(
        '/sdk_token',
        JSON.stringify({
          applicant_id: userId,
          application_id: '*'
        })
      )
      const data = info.data
      res.status(200).json({ token: data.token })

    } catch (error) {
      res.status(400).json(error)
    }
  } else {
    res.status(400).json({
      success: false,
      error: { message: 'Applicant ID not provided' }
    })
  }
}

export const getWorkflowRunId = async (req: Request, res: Response) => {
  const userId = req.body.applicant_id

  if (userId && userId.trim() !== '') {
    try {
      const info = await a.post(
        '/workflow_runs',
        JSON.stringify({
          applicant_id: userId,
          workflow_id: workflowId
        })
      )
      const data = info.data
      res.status(200).json({ id: data.id })
    } catch (error) {
      res.status(400).json({
        success: false,
        error: { message: 'Invalid token' },
        ae: error
      })
    }
  } else {
    res.status(400).json({
      success: false,
      error: { message: 'Invalid user' }
    })
  }
}

const getMotionCaptureId = async (userId: string) => {

  return a.get(`/motion_captures?applicant_id=${userId}`)
    .then(info => {
      const motion = info.data.motion_captures[0]
      const id = motion.id

      return id
    })
    .catch(err => {
      return false
    })

}

export const getMotionFrame = async (req: Request, res: Response) => {
  const userId = req.query.applicant_id

  if (userId) {
    const motionId = await getMotionCaptureId(String(userId))

    if (motionId) {

      try {
        a.get(`/motion_captures/${motionId}/frame`, {
          responseType: 'arraybuffer'
        })

          .then(response => {
            res.status(200).json({ buffer: response.data })
          })

      } catch (error) {
        res.status(400).json({
          success: false,
          error: { message: 'Image not supported' }
        })
      }

    } else {
      res.status(400).json({
        success: false,
        error: { message: 'Motion does not exists' }
      })
    }
  } else {
    res.status(400).json({
      success: false,
      error: { message: 'Applicant_id not received' }
    })
  }
}

export const deleteUser = async (req: Request, res: Response) => {

  try {
    const userId = req.body.userId
    const creation = await a.delete(`/applicants/${userId}`)

    res.status(200).json({
      success: true,
      userId: creation.data.id
    })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}