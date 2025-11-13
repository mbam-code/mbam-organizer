export interface Task {
  id: string
  title: string
  description?: string
  status: string
  dueDate: string | null
  subtasks: Subtask[]
  customFields: CustomField[]
  createdAt: string
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface CustomField {
  id: string
  name: string
  value: string
}

export interface Column {
  id: string
  title: string
  tasks: Task[]
  color?: string
  workflows?: Workflow[]
}

export interface Workflow {
  id: string
  name: string
  description?: string
  trigger: WorkflowTrigger
  actions: WorkflowAction[]
  enabled: boolean
}

export interface WorkflowTrigger {
  type: "task-added" | "task-moved-here" | "task-moved-away" | "manual"
}

export interface WorkflowAction {
  id: string
  type: "move-task" | "send-notification" | "update-field"
  targetColumnId?: string
  message?: string
  fieldName?: string
  fieldValue?: string
}

export interface Rule {
  id: string
  name: string
  condition: RuleCondition
  action: RuleAction
  enabled: boolean
}

export interface RuleCondition {
  type: "due-date" | "subtasks-completed" | "custom-field"
  field?: string
  operator:
    | "equals"
    | "not-equals"
    | "contains"
    | "greater-than"
    | "less-than"
    | "is-empty"
    | "is-not-empty"
    | "is-overdue"
    | "all-completed"
  value?: string
}

export interface RuleAction {
  type: "move-to-column"
  targetColumnId: string
}
