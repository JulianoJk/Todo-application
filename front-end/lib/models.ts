import type React from "react"
export interface IUserInfoContext {
  id: string
  _id?: string
  username: string
  email: string
  token: string
  message?: string
}

export interface ITasks {
  _id: string
  name: string
  completed: boolean
  user_id: string
  createdAt?: string
  updatedAt?: string
  error?: string
}

export type taskDispatchContext = React.Dispatch<React.SetStateAction<ITasks[]>>
