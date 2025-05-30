import { useState } from 'react'
import styles from './AddTaskForm.module.scss'

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

export const AddTaskForm = ({ onAdd }: { onAdd: (task: { title: string; description?: string; status?: TaskStatus }) => void }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('PENDING')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Title is required')
      return
    }

    onAdd({
      title,
      description: description.trim() || undefined,
      status,
    })

    setTitle('')
    setDescription('')
    setStatus('PENDING')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Add New Task</h2>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>

      <button type="submit">Add Task</button>
    </form>
  )
}
