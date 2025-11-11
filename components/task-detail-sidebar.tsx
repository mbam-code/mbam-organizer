"use client"

import { useState } from "react"
import { X, Plus, Trash2, Copy, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Task, Subtask, CustomField } from "@/types/kanban"
import { generateId, formatDate } from "@/lib/utils"

interface TaskDetailSidebarProps {
  task: Task | null
  onClose: () => void
  onUpdate: (taskId: string, updates: Partial<Task>) => void
  onDelete: (taskId: string) => void
  onDuplicate: (task: Task) => void
}

export default function TaskDetailSidebar({
  task,
  onClose,
  onUpdate,
  onDelete,
  onDuplicate,
}: TaskDetailSidebarProps) {
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [dueDate, setDueDate] = useState(task?.dueDate || "")
  const [subtasks, setSubtasks] = useState<Subtask[]>(task?.subtasks || [])
  const [customFields, setCustomFields] = useState<CustomField[]>(task?.customFields || [])
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  const [newFieldName, setNewFieldName] = useState("")
  const [newFieldValue, setNewFieldValue] = useState("")

  if (!task) return null

  const handleSave = () => {
    onUpdate(task.id, {
      title,
      description,
      dueDate: dueDate || null,
      subtasks,
      customFields,
    })
    onClose()
  }

  const addSubtask = () => {
    if (!newSubtaskTitle.trim()) return
    const newSubtask: Subtask = {
      id: `subtask-${generateId()}`,
      title: newSubtaskTitle,
      completed: false,
    }
    setSubtasks([...subtasks, newSubtask])
    setNewSubtaskTitle("")
  }

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st)))
  }

  const deleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id))
  }

  const addCustomField = () => {
    if (!newFieldName.trim() || !newFieldValue.trim()) return
    const newField: CustomField = {
      id: `field-${generateId()}`,
      name: newFieldName,
      value: newFieldValue,
    }
    setCustomFields([...customFields, newField])
    setNewFieldName("")
    setNewFieldValue("")
  }

  const deleteCustomField = (id: string) => {
    setCustomFields(customFields.filter((cf) => cf.id !== id))
  }

  const completedCount = subtasks.filter((st) => st.completed).length
  const totalCount = subtasks.length

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Task</h2>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6 p-4">
          {/* Title */}
          <div>
            <Label className="dark:text-gray-200">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="dark:text-gray-200">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              rows={4}
            />
          </div>

          {/* Due Date */}
          <div>
            <Label className="dark:text-gray-200 flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> Due Date
            </Label>
            <Input
              type="date"
              value={dueDate ? dueDate.split("T")[0] : ""}
              onChange={(e) => {
                const dateStr = e.target.value ? new Date(e.target.value).toISOString() : ""
                setDueDate(dateStr)
              }}
              className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            {dueDate && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {formatDate(dueDate)}
              </p>
            )}
          </div>

          {/* Subtasks */}
          <div className="border-t dark:border-gray-700 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <Label className="dark:text-gray-200">
                Subtasks ({completedCount}/{totalCount})
              </Label>
            </div>

            {subtasks.length > 0 && (
              <div className="mb-3 space-y-2">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(subtask.id)}
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                    />
                    <span
                      className={`flex-1 text-sm ${
                        subtask.completed
                          ? "text-gray-400 dark:text-gray-500 line-through"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {subtask.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      onClick={() => deleteSubtask(subtask.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="New subtask"
                onKeyPress={(e) => e.key === "Enter" && addSubtask()}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              <Button size="sm" onClick={addSubtask}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Custom Fields */}
          <div className="border-t dark:border-gray-700 pt-4">
            <Label className="dark:text-gray-200 block mb-3">Custom Fields</Label>

            {customFields.length > 0 && (
              <div className="mb-3 space-y-2">
                {customFields.map((field) => (
                  <div key={field.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{field.name}</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{field.value}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 flex-shrink-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      onClick={() => deleteCustomField(field.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Input
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="Field name (e.g., Priority)"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              <Input
                value={newFieldValue}
                onChange={(e) => setNewFieldValue(e.target.value)}
                placeholder="Field value (e.g., High)"
                onKeyPress={(e) => e.key === "Enter" && addCustomField()}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              <Button size="sm" onClick={addCustomField} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Field
              </Button>
            </div>
          </div>

          {/* Status Info */}
          <div className="border-t dark:border-gray-700 pt-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>
                <span className="font-medium">Status:</span> {task.status}
              </p>
              <p>
                <span className="font-medium">Created:</span> {formatDate(task.createdAt)}
              </p>
              <p>
                <span className="font-medium">ID:</span> {task.id}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-2">
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
          <Button
            variant="outline"
            className="w-full dark:border-gray-600 dark:text-gray-200"
            onClick={() => {
              onDuplicate(task)
              onClose()
            }}
          >
            <Copy className="mr-2 h-4 w-4" /> Duplicate
          </Button>
          <Button
            variant="outline"
            className="w-full text-red-600 dark:text-red-400 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
            onClick={() => {
              onDelete(task.id)
              onClose()
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
