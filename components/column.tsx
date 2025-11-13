"use client"

import { useState } from "react"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { MoreHorizontal, Plus, Trash2, Palette } from "lucide-react"
import TaskCard from "./task-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Task, Column as ColumnType } from "@/types/kanban"
import { generateId } from "@/lib/utils"

const COLUMN_COLORS = [
  { name: "Default", value: "bg-white dark:bg-gray-900" },
  { name: "Red", value: "bg-red-50 dark:bg-red-900/20" },
  { name: "Amber", value: "bg-amber-50 dark:bg-amber-900/20" },
  { name: "Gray", value: "bg-gray-50 dark:bg-gray-800" },
  { name: "Green", value: "bg-emerald-50 dark:bg-emerald-900/20" },
  { name: "Slate", value: "bg-slate-50 dark:bg-slate-900/20" },
  { name: "Orange", value: "bg-orange-50 dark:bg-orange-900/20" },
  { name: "Accent", value: "bg-yellow-50 dark:bg-yellow-900/20" },
]

interface ColumnProps {
  column: ColumnType
  onAddTask: (columnId: string, task: Task) => void
  onTaskClick: (task: Task) => void
  onColumnClick: () => void
  onDeleteColumn: () => void
  onUpdateColumn: (columnId: string, updates: Partial<ColumnType>) => void
  onDuplicateTask: (task: Task, columnId: string) => void
}

export default function Column({
  column,
  onAddTask,
  onTaskClick,
  onColumnClick,
  onDeleteColumn,
  onUpdateColumn,
  onDuplicateTask,
}: ColumnProps) {
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: `task-${generateId()}`,
      title: newTaskTitle,
      description: newTaskDescription,
      status: column.title,
      dueDate: null,
      subtasks: [],
      customFields: [],
      createdAt: new Date().toISOString(),
    }

    onAddTask(column.id, newTask)
    setNewTaskTitle("")
    setNewTaskDescription("")
    setIsAddingTask(false)
  }

  const handleColorChange = (color: string) => {
    onUpdateColumn(column.id, { color })
    setShowColorPicker(false)
  }

  const handleDeleteColumn = () => {
    if (column.tasks.length > 0) {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${column.title}" and all ${column.tasks.length} task(s) in it? This cannot be undone.`
      )
      if (!confirmed) return
    } else {
      const confirmed = window.confirm(`Are you sure you want to delete "${column.title}"? This cannot be undone.`)
      if (!confirmed) return
    }
    onDeleteColumn()
  }

  return (
    <div className="shrink-0 w-72 flex flex-col bg-[var(--bg-tertiary)] dark:bg-[var(--dark-bg-secondary)] rounded-lg shadow-sm border border-[var(--border-color)] dark:border-[var(--dark-border-color)] overflow-hidden">
      <div className="p-3 flex justify-between items-center border-b bg-black dark:bg-black border-b-4 border-gold">
        <h3 className="font-medium text-sm text-gold flex items-center cursor-pointer hover:opacity-75 transition-opacity" onClick={onColumnClick}>
          {column.title}
          <span className="ml-2 text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full font-semibold">
            {column.tasks.length}
          </span>
        </h3>
        <div className="flex gap-1">
          <Button
            size="sm"
            className="h-8 w-8 p-0 text-gold hover:bg-gold/20 transition-colors"
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Change column color"
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <Palette className="h-5 w-5" />
          </Button>
          <Button
            size="sm"
            className="h-8 w-8 p-0 text-gold hover:bg-red-600/30 transition-colors"
            onClick={handleDeleteColumn}
            title="Delete column"
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {showColorPicker && (
        <div className="p-3 border-b border-[var(--border-color)] dark:border-[var(--dark-border-color)] bg-[var(--bg-tertiary)] dark:bg-[var(--dark-bg-secondary)]">
          <h4 className="font-medium text-xs text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] mb-2">Column Color</h4>
          <div className="grid grid-cols-4 gap-2">
            {COLUMN_COLORS.map((color) => (
              <button
                key={color.value}
                className={`h-8 w-full rounded-md ${color.value} border-2 dark:border-gray-700 hover:opacity-80 transition-opacity ${
                  column.color === color.value ? "border-gray-400 dark:border-gray-500" : "border-gray-200"
                }`}
                onClick={() => handleColorChange(color.value)}
                title={`Set to ${color.name}`}
              />
            ))}
          </div>
        </div>
      )}

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 overflow-y-auto transition-colors ${snapshot.isDraggingOver ? "bg-gold/10 dark:bg-gold/5" : ""}`}
          >
            {column.tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? "rotate-3 shadow-lg opacity-90" : ""}
                  >
                    <TaskCard
                      task={task}
                      onClick={() => onTaskClick(task)}
                      onDuplicate={() => onDuplicateTask(task, column.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {isAddingTask ? (
              <div className="mt-2 p-3 bg-[var(--bg-secondary)] dark:bg-[var(--dark-bg-secondary)] rounded-md shadow-sm border border-[var(--border-color)] dark:border-[var(--dark-border-color)]">
                <Label htmlFor="task-title" className="text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] text-sm">
                  Task Title
                </Label>
                <Input
                  id="task-title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter task title"
                  className="mb-2 bg-[var(--bg-primary)] dark:bg-[var(--dark-bg-tertiary)] border-[var(--border-color)] dark:border-[var(--dark-border-color)] text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]"
                />
                <Label htmlFor="task-description" className="text-[var(--text-primary)] dark:text-[var(--dark-text-primary)] text-sm">
                  Description (optional)
                </Label>
                <Textarea
                  id="task-description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Enter task description"
                  className="mb-2 bg-[var(--bg-primary)] dark:bg-[var(--dark-bg-tertiary)] border-[var(--border-color)] dark:border-[var(--dark-border-color)] text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddTask}>
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddingTask(false)}
                    className="dark:border-gray-600 dark:text-gray-200"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="w-full mt-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 justify-start"
                onClick={() => setIsAddingTask(true)}
              >
                <Plus className="mr-2 h-5 w-5" /> Add Task
              </Button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
