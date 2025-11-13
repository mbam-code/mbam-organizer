"use client"

import { Calendar, CheckSquare, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Task } from "@/types/kanban"
import { formatDate, isOverdue } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onClick: () => void
  onDuplicate: () => void
}

export default function TaskCard({ task, onClick, onDuplicate }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length
  const totalSubtasks = task.subtasks.length
  const overdue = isOverdue(task.dueDate, task.status)

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDuplicate()
  }

  return (
    <div
      className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-burgundy/20 dark:hover:border-burgundy/30 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-1 flex-1">{task.title}</h4>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
          onClick={handleDuplicate}
          title="Duplicate task"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mt-2">
        {task.dueDate && (
          <div
            className={`flex items-center text-xs font-medium px-2.5 py-1 rounded ${
              overdue ? "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20" : "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700"
            }`}
          >
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(task.dueDate)}
          </div>
        )}

        {totalSubtasks > 0 && (
          <div className="flex items-center text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded">
            <CheckSquare className="h-3 w-3 mr-1" />
            {completedSubtasks}/{totalSubtasks}
          </div>
        )}

        {task.customFields.map(
          (field) =>
            field.value && (
              <div
                key={field.id}
                className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded"
              >
                {field.name}: {field.value.toString().length > 10 ? field.value.toString().substring(0, 10) + "..." : field.value.toString()}
              </div>
            ),
        )}
      </div>
    </div>
  )
}
