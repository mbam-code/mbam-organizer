"use client"

import { useState, useEffect } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { Plus } from "lucide-react"
import Column from "./column"
import TaskDetailSidebar from "./task-detail-sidebar"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Task, Column as ColumnType } from "@/types/kanban"
import { generateId } from "@/lib/utils"

const STORAGE_KEY = "kanban-state"

interface AppState {
  columns: ColumnType[]
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const state: AppState = JSON.parse(saved)
      setColumns(state.columns)
    } else {
      // Initialize with default columns and mock data
      const now = new Date()
      const today = now.toISOString()
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      setColumns([
        {
          id: "col-1",
          title: "To Do",
          tasks: [
            {
              id: "task-1",
              title: "Review production pipeline specs",
              description: "Review the latest production pipeline requirements and document changes",
              status: "To Do",
              dueDate: tomorrow.toISOString(),
              subtasks: [
                { id: "st-1", title: "Read specification document", completed: true },
                { id: "st-2", title: "Create summary notes", completed: false },
                { id: "st-3", title: "Schedule team review", completed: false },
              ],
              customFields: [
                { id: "cf-1", name: "Priority", value: "High" },
                { id: "cf-2", name: "Assigned", value: "John Smith" },
              ],
              createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "task-2",
              title: "Update database schema",
              description: "Add new columns for content versioning",
              status: "To Do",
              dueDate: nextWeek.toISOString(),
              subtasks: [
                { id: "st-4", title: "Design schema changes", completed: false },
                { id: "st-5", title: "Write migration script", completed: false },
              ],
              customFields: [
                { id: "cf-3", name: "Priority", value: "Medium" },
                { id: "cf-4", name: "Assigned", value: "Sarah Johnson" },
              ],
              createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
          color: undefined,
        },
        {
          id: "col-2",
          title: "In Progress",
          tasks: [
            {
              id: "task-3",
              title: "Implement content validation",
              description: "Build validation rules for uploaded content",
              status: "In Progress",
              dueDate: today,
              subtasks: [
                { id: "st-6", title: "Define validation rules", completed: true },
                { id: "st-7", title: "Implement validator module", completed: true },
                { id: "st-8", title: "Add unit tests", completed: false },
              ],
              customFields: [
                { id: "cf-5", name: "Priority", value: "High" },
                { id: "cf-6", name: "Progress", value: "70%" },
              ],
              createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
          color: "bg-blue-50 dark:bg-blue-900/30",
        },
        {
          id: "col-3",
          title: "Completed",
          tasks: [
            {
              id: "task-4",
              title: "Set up CI/CD pipeline",
              description: "Configure automated testing and deployment",
              status: "Completed",
              dueDate: yesterday.toISOString(),
              subtasks: [
                { id: "st-9", title: "Configure GitHub Actions", completed: true },
                { id: "st-10", title: "Set up test environment", completed: true },
                { id: "st-11", title: "Deploy to staging", completed: true },
              ],
              customFields: [
                { id: "cf-7", name: "Priority", value: "High" },
                { id: "cf-8", name: "CompletedBy", value: "Mike Chen" },
              ],
              createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: "task-5",
              title: "Create API documentation",
              description: "Document all REST endpoints with examples",
              status: "Completed",
              dueDate: yesterday.toISOString(),
              subtasks: [
                { id: "st-12", title: "List all endpoints", completed: true },
                { id: "st-13", title: "Write endpoint docs", completed: true },
                { id: "st-14", title: "Create usage examples", completed: true },
              ],
              customFields: [
                { id: "cf-9", name: "Priority", value: "Medium" },
                { id: "cf-10", name: "CompletedBy", value: "Emma Wilson" },
              ],
              createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
          color: "bg-green-50 dark:bg-green-900/30",
        },
      ])
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever columns change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ columns }))
    }
  }, [columns, isLoaded])

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    // No valid destination
    if (!destination) return

    // Same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    // Find the task
    let task: Task | undefined
    let sourceColumnIndex = -1

    for (let i = 0; i < columns.length; i++) {
      const foundTask = columns[i].tasks.find((t) => t.id === draggableId)
      if (foundTask) {
        task = foundTask
        sourceColumnIndex = i
        break
      }
    }

    if (!task) return

    // Create new columns array
    const newColumns = columns.map((col, idx) => {
      const newCol = { ...col, tasks: [...col.tasks] }

      // Remove from source
      if (col.id === source.droppableId) {
        newCol.tasks.splice(source.index, 1)
      }

      // Add to destination
      if (col.id === destination.droppableId) {
        const updatedTask = { ...task, status: col.title }
        newCol.tasks.splice(destination.index, 0, updatedTask)
      }

      return newCol
    })

    setColumns(newColumns)
  }

  const addTask = (columnId: string, task: Task) => {
    setColumns(
      columns.map((col) => (col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col)),
    )
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setColumns(
      columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)),
      })),
    )
  }

  const deleteTask = (taskId: string) => {
    setColumns(
      columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => task.id !== taskId),
      })),
    )
  }

  const duplicateTask = (task: Task, sourceColumnId: string) => {
    const newTask: Task = {
      ...task,
      id: `task-${generateId()}`,
      createdAt: new Date().toISOString(),
    }
    addTask(sourceColumnId, newTask)
  }

  const addColumn = () => {
    if (!newColumnTitle.trim()) return

    const newColumn: ColumnType = {
      id: `col-${generateId()}`,
      title: newColumnTitle,
      tasks: [],
      color: undefined,
    }

    setColumns([...columns, newColumn])
    setNewColumnTitle("")
    setIsAddingColumn(false)
  }

  const deleteColumn = (columnId: string) => {
    setColumns(columns.filter((col) => col.id !== columnId))
  }

  const updateColumn = (columnId: string, updates: Partial<ColumnType>) => {
    setColumns(columns.map((col) => (col.id === columnId ? { ...col, ...updates } : col)))
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">MBAM Organizer</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">Production line content management system</p>
          </div>
          <ThemeToggle />
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onAddTask={addTask}
                onTaskClick={setSelectedTask}
                onDeleteColumn={() => deleteColumn(column.id)}
                onUpdateColumn={updateColumn}
                onDuplicateTask={duplicateTask}
              />
            ))}

            {isAddingColumn ? (
              <div className="shrink-0 w-72 flex flex-col bg-white dark:bg-gray-800 rounded-md shadow-sm border dark:border-gray-700 p-4">
                <Input
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Enter column name"
                  className="mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={addColumn}>
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingColumn(false)
                      setNewColumnTitle("")
                    }}
                    className="dark:border-gray-600 dark:text-gray-200"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="shrink-0 h-12 px-4 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => setIsAddingColumn(true)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Column
              </Button>
            )}
          </div>
        </DragDropContext>

        <TaskDetailSidebar
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onDuplicate={(task) => {
            const sourceColumn = columns.find((col) => col.tasks.some((t) => t.id === task.id))
            if (sourceColumn) {
              duplicateTask(task, sourceColumn.id)
            }
          }}
        />
      </div>
    </div>
  )
}
