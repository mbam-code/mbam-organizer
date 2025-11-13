"use client"

import { useState } from "react"
import { X, Plus, Trash2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Column, Workflow, WorkflowTrigger, WorkflowAction } from "@/types/kanban"
import { generateId } from "@/lib/utils"

interface ColumnDetailSidebarProps {
  column: Column | null
  columns: Column[]
  onClose: () => void
  onUpdate: (columnId: string, updates: Partial<Column>) => void
}

const TRIGGER_OPTIONS: { label: string; value: WorkflowTrigger["type"] }[] = [
  { label: "Task Added", value: "task-added" },
  { label: "Task Moved Here", value: "task-moved-here" },
  { label: "Task Moved Away", value: "task-moved-away" },
  { label: "Manual", value: "manual" },
]

const ACTION_TYPES: { label: string; value: WorkflowAction["type"] }[] = [
  { label: "Move Task", value: "move-task" },
  { label: "Send Notification", value: "send-notification" },
  { label: "Update Field", value: "update-field" },
]

export default function ColumnDetailSidebar({
  column,
  columns,
  onClose,
  onUpdate,
}: ColumnDetailSidebarProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>(column?.workflows || [])
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null)
  const [showNewWorkflow, setShowNewWorkflow] = useState(false)
  const [workflowName, setWorkflowName] = useState("")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [triggerType, setTriggerType] = useState<WorkflowTrigger["type"]>("task-added")
  const [actions, setActions] = useState<WorkflowAction[]>([])
  const [newActionType, setNewActionType] = useState<WorkflowAction["type"]>("move-task")
  const [targetColumnId, setTargetColumnId] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")
  const [fieldName, setFieldName] = useState("")
  const [fieldValue, setFieldValue] = useState("")

  if (!column) return null

  const handleSave = () => {
    onUpdate(column.id, { workflows })
    onClose()
  }

  const addWorkflow = () => {
    if (!workflowName.trim() || actions.length === 0) return

    const newWorkflow: Workflow = {
      id: `workflow-${generateId()}`,
      name: workflowName,
      description: workflowDescription || undefined,
      trigger: { type: triggerType },
      actions,
      enabled: true,
    }

    setWorkflows([...workflows, newWorkflow])
    resetWorkflowForm()
  }

  const resetWorkflowForm = () => {
    setShowNewWorkflow(false)
    setWorkflowName("")
    setWorkflowDescription("")
    setTriggerType("task-added")
    setActions([])
    setNewActionType("move-task")
    setTargetColumnId("")
    setNotificationMessage("")
    setFieldName("")
    setFieldValue("")
  }

  const addAction = () => {
    let newAction: WorkflowAction | null = null

    switch (newActionType) {
      case "move-task":
        if (!targetColumnId) return
        newAction = {
          id: `action-${generateId()}`,
          type: "move-task",
          targetColumnId,
        }
        break
      case "send-notification":
        if (!notificationMessage) return
        newAction = {
          id: `action-${generateId()}`,
          type: "send-notification",
          message: notificationMessage,
        }
        break
      case "update-field":
        if (!fieldName || !fieldValue) return
        newAction = {
          id: `action-${generateId()}`,
          type: "update-field",
          fieldName,
          fieldValue,
        }
        break
    }

    if (newAction) {
      setActions([...actions, newAction])
      setTargetColumnId("")
      setNotificationMessage("")
      setFieldName("")
      setFieldValue("")
    }
  }

  const removeAction = (actionId: string) => {
    setActions(actions.filter((a) => a.id !== actionId))
  }

  const deleteWorkflow = (workflowId: string) => {
    setWorkflows(workflows.filter((w) => w.id !== workflowId))
  }

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(
      workflows.map((w) => (w.id === workflowId ? { ...w, enabled: !w.enabled } : w))
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Zap className="mr-2 h-4 w-4 text-yellow-500" /> {column.title} Workflows
          </h2>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6 p-4">
          {/* Existing Workflows */}
          {workflows.length > 0 && (
            <div className="border-b dark:border-gray-700 pb-4">
              <Label className="dark:text-gray-200 block mb-3">Active Workflows</Label>
              <div className="space-y-2">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                          {workflow.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Trigger: {workflow.trigger.type.replace("-", " ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={workflow.enabled}
                          onChange={() => toggleWorkflow(workflow.id)}
                          className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                          title="Enable/Disable workflow"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                          onClick={() => deleteWorkflow(workflow.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {workflow.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {workflow.description}
                      </p>
                    )}
                    <div className="text-xs space-y-1">
                      {workflow.actions.map((action) => (
                        <p key={action.id} className="text-gray-700 dark:text-gray-300">
                          • {action.type === "move-task" && `Move to ${columns.find((c) => c.id === action.targetColumnId)?.title || "Unknown"}`}
                          {action.type === "send-notification" && `Notify: ${action.message}`}
                          {action.type === "update-field" && `Set ${action.fieldName} = ${action.fieldValue}`}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Workflow Section */}
          {!showNewWorkflow ? (
            <Button onClick={() => setShowNewWorkflow(true)} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Workflow
            </Button>
          ) : (
            <div className="border dark:border-gray-700 p-4 rounded-md bg-gray-50 dark:bg-gray-700/30">
              <h3 className="font-medium mb-4 text-gray-900 dark:text-white">New Workflow</h3>

              {/* Workflow Name */}
              <div className="mb-4">
                <Label className="dark:text-gray-200 text-sm">Workflow Name</Label>
                <Input
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="e.g., Auto-escalate overdue"
                  className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <Label className="dark:text-gray-200 text-sm">Description (optional)</Label>
                <Textarea
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  placeholder="What does this workflow do?"
                  className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  rows={2}
                />
              </div>

              {/* Trigger */}
              <div className="mb-4">
                <Label className="dark:text-gray-200 text-sm">Trigger Event</Label>
                <select
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value as WorkflowTrigger["type"])}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                >
                  {TRIGGER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="mb-4">
                <Label className="dark:text-gray-200 text-sm block mb-2">Actions</Label>

                {actions.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {actions.map((action) => (
                      <div
                        key={action.id}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600"
                      >
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          {action.type === "move-task" &&
                            `Move to ${columns.find((c) => c.id === action.targetColumnId)?.title || "Unknown"}`}
                          {action.type === "send-notification" && `Notify: ${action.message}`}
                          {action.type === "update-field" && `Set ${action.fieldName} = ${action.fieldValue}`}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 text-red-600 dark:text-red-400"
                          onClick={() => removeAction(action.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Type */}
                <div className="mb-2">
                  <select
                    value={newActionType}
                    onChange={(e) => setNewActionType(e.target.value as WorkflowAction["type"])}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 text-sm"
                  >
                    {ACTION_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action-specific inputs */}
                {newActionType === "move-task" && (
                  <div className="mb-2">
                    <select
                      value={targetColumnId}
                      onChange={(e) => setTargetColumnId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 text-sm"
                    >
                      <option value="">Select target column</option>
                      {columns
                        .filter((c) => c.id !== column.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {newActionType === "send-notification" && (
                  <div className="mb-2">
                    <Input
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                      placeholder="Notification message"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm"
                    />
                  </div>
                )}

                {newActionType === "update-field" && (
                  <>
                    <div className="mb-2">
                      <Input
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                        placeholder="Field name"
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm"
                      />
                    </div>
                    <div className="mb-2">
                      <Input
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                        placeholder="Field value"
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm"
                      />
                    </div>
                  </>
                )}

                <Button size="sm" onClick={addAction} className="w-full text-sm">
                  <Plus className="h-3 w-3 mr-1" /> Add Action
                </Button>
              </div>

              {/* Form Actions */}
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  onClick={addWorkflow}
                  disabled={!workflowName.trim() || actions.length === 0}
                  className="flex-1"
                >
                  Create Workflow
                </Button>
                <Button size="sm" variant="outline" onClick={resetWorkflowForm} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="border-t dark:border-gray-700 pt-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>
                <span className="font-medium">Column:</span> {column.title}
              </p>
              <p>
                <span className="font-medium">ID:</span> {column.id}
              </p>
              <p>
                <span className="font-medium">Total Workflows:</span> {workflows.length}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <Button onClick={handleSave} className="w-full">
            Save Workflows
          </Button>
        </div>
      </div>
    </div>
  )
}
