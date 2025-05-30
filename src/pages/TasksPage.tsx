import { useEffect, useState } from 'react'
import { getAllTasks } from '../api/tasks'
import styles from './TasksPage.module.scss'

type Task = {
  id: number
  title: string
  description?: string
  status?: string
}

const getStatusClass = (status?: string) => {
  if (!status) return ''
  if (status === 'PENDING') return styles.todoStatus + ' ' + styles.pending
  if (status === 'IN_PROGRESS') return styles.todoStatus + ' ' + styles.inprogress
  if (status === 'COMPLETED') return styles.todoStatus + ' ' + styles.completed
  return styles.todoStatus
}

export const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getAllTasks()
      setTasks(data)
    }
    fetchTasks()
  }, [])

  return (
    <div className={styles.page}>
      <h1>📋 All Tasks</h1>
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          fontWeight: 700,
          color: '#a18fff',
          fontSize: '1.07rem',
          marginBottom: '1.2rem',
          paddingLeft: '0.2rem',
        }}
      >
        <span style={{ minWidth: 120 }}>Title</span>
        <span style={{ flex: 1, marginLeft: 8 }}>Description</span>
        <span style={{ minWidth: 110, marginLeft: 10 }}>Status</span>
        <span style={{ minWidth: 120 }}></span>
      </div>
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`${styles.taskCard} ${selectedId === task.id ? styles.selected : ''}`}
          onClick={() => setSelectedId(task.id === selectedId ? null : task.id)}
        >
          <span className={styles.todoTitle}>{task.title}</span>
          <span className={styles.todoDescription}>{task.description || '-'}</span>
          <span
            className={
              `${styles.todoStatus} ` +
              (task.status === 'PENDING'
                ? styles.pending
                : task.status === 'IN_PROGRESS'
                ? styles.inprogress
                : task.status === 'COMPLETED'
                ? styles.completed
                : '')
            }
          >
            {task.status
              ? task.status === 'PENDING'
                ? 'Pending'
                : task.status === 'IN_PROGRESS'
                ? 'In Progress'
                : task.status === 'COMPLETED'
                ? 'Completed'
                : task.status
              : '-'}
          </span>
          {selectedId === task.id && (
            <div className={styles.actions}>
              <button>Update</button>
              <button>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
