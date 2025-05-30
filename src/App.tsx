import { useEffect, useState } from 'react'
import styles from './App.module.scss'
import { getAllTasks, createTask, updateTask, deleteTask } from './api/tasks'
import { AddTaskForm } from './components/AddTaskForm/AddTaskForm'

type Task = {
  id: number
  title: string
  description?: string
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<{title: string, description: string, status: Task['status']}>({
    title: '',
    description: '',
    status: 'PENDING'
  })

  useEffect(() => {
    getAllTasks().then(setTasks)
  }, [])

  const refreshTasks = () => getAllTasks().then(setTasks)

  const handleAddTask = async (task: Omit<Task, 'id'>) => {
    await createTask(task)
    setShowAdd(false)
    refreshTasks()
  }

  const handleDelete = async (id: number) => {
    await deleteTask(id)
    setTasks(tasks => tasks.filter(t => t.id !== id))
    if (selectedId === id) setSelectedId(null)
    if (editId === id) setEditId(null)
  }

  const handleEditClick = (task: Task) => {
    setEditId(task.id)
    setEditValues({
      title: task.title,
      description: task.description || '',
      status: task.status || 'PENDING'
    })
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditValues(v => ({ ...v, [name]: value }))
  }

  const handleEditSave = async (id: number) => {
    await updateTask(id, editValues)
    setEditId(null)
    setSelectedId(null)
    refreshTasks()
  }

  return (
    <div className={styles.page}>
      <div className={styles.navbar}>
        <h1>📝 Taskly</h1>
      </div>
      <div className={styles.taskBar}>
        <button onClick={() => setShowAdd(true)}>➕ Add Task</button>
      </div>

      <div className={styles.headerRow}>
        <span>Title</span>
        <span>Description</span>
        <span>Status</span>
        <span></span>
      </div>

      {tasks.map((task) =>
        editId === task.id ? (
          <div key={task.id} className={`${styles.taskCard} ${styles.selected}`}>
            <input
              className={styles.todoTitle}
              name="title"
              value={editValues.title}
              onChange={handleEditChange}
              autoFocus
            />
            <textarea
              className={styles.todoDescription}
              name="description"
              value={editValues.description}
              onChange={handleEditChange}
              rows={1}
            />
            <select
              className={styles.todoStatus}
              name="status"
              value={editValues.status}
              onChange={handleEditChange}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <div className={styles.actions}>
              <button onClick={() => handleEditSave(task.id)}>Save</button>
              <button onClick={() => setEditId(null)}>Cancel</button>
            </div>
          </div>
        ) : (
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
                <button onClick={e => { e.stopPropagation(); handleEditClick(task) }}>Update</button>
                <button onClick={e => { e.stopPropagation(); handleDelete(task.id) }}>Delete</button>
              </div>
            )}
          </div>
        )
      )}

      {showAdd && (
        <div className={styles.modalOverlay} onClick={() => setShowAdd(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <AddTaskForm onAdd={handleAddTask} />
          </div>
        </div>
      )}
    </div>
  )
}
