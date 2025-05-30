import axios from 'axios'

const API_URL = 'http://localhost:8080/task' 

export const createTask = async (task: {
  title: string
  description?: string
  status?: string
}) => {
  const response = await axios.post(API_URL, task)
  return response.data
}

export const getAllTasks = async () => {
  const res = await axios.get(API_URL)
  return res.data
}

export const updateTask = async (id: number, task: {
  title: string
  description?: string
  status?: string
}) => {
  const response = await axios.put(`${API_URL}/${id}`, task)
  return response.data
}

export const deleteTask = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data
}