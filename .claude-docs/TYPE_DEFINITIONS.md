# Type Definitions for MBAM Organizer

Complete TypeScript interface definitions required for the application. These types define the data structures for tasks, columns, and automation rules.

## Core Types

### Task Interface
```typescript
export interface Task {
  id: string                      // Unique identifier (e.g., "task-abc123")
  title: string                   // Task title/heading
  description?: string            // Optional detailed description
  status: string                  // Current column name (e.g., "To Do", "In Progress")
  dueDate: string | null          // ISO 8601 date string (e.g., "2024-11-15T00:00:00.000Z") or null
  subtasks: Subtask[]            // Array of sub-items
  customFields: CustomField[]    // Array of dynamic custom fields
  createdAt: string              // ISO 8601 creation timestamp
}
```

**Usage Notes:**
- `id` should be generated with `generateId()` function (format: "task-" + random string)
- `status` should match the column title it's in (used for automation rules)
- `dueDate` is null if no due date is set
- `subtasks` and `customFields` are empty arrays if not in use
- `createdAt` is set when task is created, never modified

### Subtask Interface
```typescript
export interface Subtask {
  id: string          // Unique identifier (e.g., "subtask-xyz789")
  title: string       // Subtask text
  completed: boolean  // Whether subtask is marked done
}
```

**Usage Notes:**
- Used to break down tasks into smaller items
- Can be toggled between completed/incomplete
- Completion percentage shown on parent task card (e.g., "2/4")
- Used in automation rules (e.g., "move task when all subtasks completed")

### CustomField Interface
```typescript
export interface CustomField {
  id: string      // Unique identifier (e.g., "field-abc123")
  name: string    // Field name (e.g., "Priority", "Assigned To", "Story Points")
  value: string   // Field value (e.g., "High", "John Doe", "8")
}
```

**Usage Notes:**
- Dynamic fields added by users
- Name and value are both user-editable
- Displayed on task cards (truncated to 10 characters)
- Used in automation rule conditions
- Value is always stored as string (even for numbers)

### Column Interface
```typescript
export interface Column {
  id: string              // Unique identifier (e.g., "col-1", "col-2")
  title: string           // Column name (e.g., "To Do", "In Progress", "Done")
  tasks: Task[]          // Array of tasks in this column
  color?: string         // Optional Tailwind color class (see COLUMN_COLORS below)
}
```

**Usage Notes:**
- `id` can be simple (col-1, col-2, etc.)
- `title` is displayed as column header
- `tasks` is reordered during drag-drop
- `color` applies to column header background
- Color string format: "bg-blue-50 dark:bg-blue-900/30"

---

## Automation Types

### Rule Interface
```typescript
export interface Rule {
  id: string              // Unique identifier
  name: string            // User-friendly rule name
  condition: RuleCondition
  action: RuleAction
  enabled: boolean        // Whether rule is active
}
```

**Usage Notes:**
- Rules are evaluated whenever relevant state changes
- `enabled` allows disabling without deletion
- Each rule has exactly one condition and one action

### RuleCondition Interface
```typescript
export interface RuleCondition {
  type: "due-date" | "subtasks-completed" | "custom-field"
  field?: string          // Field name (for custom-field type)
  operator:
    | "equals"            // Exact match
    | "not-equals"        // Not equal
    | "contains"          // String contains
    | "greater-than"      // For dates/numbers
    | "less-than"         // For dates/numbers
    | "is-empty"          // Field/subtasks empty
    | "is-not-empty"      // Field/subtasks not empty
    | "is-overdue"        // Due date in past
    | "all-completed"     // All subtasks done
  value?: string          // Comparison value
}
```

**Condition Type Details:**

#### due-date
- Operators: `is-overdue`, `greater-than`, `less-than`
- `is-overdue`: No value needed, checks if due date has passed
- `greater-than` / `less-than`: value is days from today (e.g., "5" = 5 days)

#### subtasks-completed
- Operators: `all-completed`, `greater-than`, `less-than`
- `all-completed`: No value needed, triggers when 100% done
- `greater-than` / `less-than`: value is percentage (e.g., "50" = 50%)

#### custom-field
- Operators: `equals`, `not-equals`, `contains`, `is-empty`, `is-not-empty`
- `field`: Must specify custom field name to check
- `value`: Comparison value for equals/contains

### RuleAction Interface
```typescript
export interface RuleAction {
  type: "move-to-column"
  targetColumnId: string  // ID of destination column
}
```

**Usage Notes:**
- Currently only supports moving tasks
- `targetColumnId` must match an existing column's id
- Task's `status` field is updated to match destination column title
- Actions are extensible (ready for new action types)

---

## Column Color System

Predefined colors available for column headers. Each color has light and dark mode variants.

```typescript
const COLUMN_COLORS = [
  { name: "Default", value: "bg-white dark:bg-gray-800" },
  { name: "Blue", value: "bg-blue-50 dark:bg-blue-900/30" },
  { name: "Green", value: "bg-green-50 dark:bg-green-900/30" },
  { name: "Yellow", value: "bg-yellow-50 dark:bg-yellow-900/30" },
  { name: "Purple", value: "bg-purple-50 dark:bg-purple-900/30" },
  { name: "Pink", value: "bg-pink-50 dark:bg-pink-900/30" },
  { name: "Orange", value: "bg-orange-50 dark:bg-orange-900/30" },
  { name: "Cyan", value: "bg-cyan-50 dark:bg-cyan-900/30" },
]
```

**Color Format:**
- Light mode: `bg-{color}-50` for very light background
- Dark mode: `dark:bg-{color}-900/30` for dark with 30% opacity
- Applied directly as className to column header div

---

## Mock Data Structure

Example of how to create mock tasks:

```typescript
const createDate = (daysFromNow: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString()
}

const taskExample: Task = {
  id: `task-${generateId()}`,
  title: "Research competitor products",
  description: "Analyze top 5 competitor products and create a comparison report",
  status: "To Do",  // Matches column title
  dueDate: createDate(5),  // 5 days from now
  subtasks: [
    {
      id: `subtask-${generateId()}`,
      title: "Identify top competitors",
      completed: false
    },
    {
      id: `subtask-${generateId()}`,
      title: "Create comparison criteria",
      completed: false
    },
  ],
  customFields: [
    {
      id: `field-${generateId()}`,
      name: "Priority",
      value: "High"
    },
    {
      id: `field-${generateId()}`,
      name: "Estimated Hours",
      value: "8"
    },
  ],
  createdAt: createDate(-2),  // Created 2 days ago
}
```

---

## Type Usage in Components

### KanbanBoard Component
```typescript
// State types
const [columns, setColumns] = useState<Column[]>([...])
const [selectedTask, setSelectedTask] = useState<Task | null>(null)
const [rules, setRules] = useState<Rule[]>([...])

// Methods return/use types
const addTask = (columnId: string, task: Task): void => {}
const deleteTask = (taskId: string): void => {}
const updateTask = (taskId: string, updates: Partial<Task>): void => {}
const duplicateTask = (task: Task, columnId: string): void => {}
const addColumn = (column: Column): void => {}
const deleteColumn = (columnId: string): void => {}
```

### Column Component
```typescript
interface ColumnProps {
  column: Column
  onAddTask: (columnId: string, task: Task) => void
  onTaskClick: (task: Task) => void
  onDeleteColumn: () => void
  onUpdateColumn: (columnId: string, updates: Partial<Column>) => void
  onDuplicateTask: (task: Task, columnId: string) => void
}
```

### TaskCard Component
```typescript
interface TaskCardProps {
  task: Task
  onClick: () => void
  onDuplicate: () => void
}
```

### TaskDetailSidebar Component
```typescript
interface TaskDetailSidebarProps {
  task: Task | null
  onClose: () => void
  onUpdate: (updates: Partial<Task>) => void
  onDelete: () => void
}
```

### AutomationRules Component
```typescript
interface AutomationRulesProps {
  rules: Rule[]
  columns: Column[]
  onAddRule: (rule: Rule) => void
  onUpdateRule: (ruleId: string, updates: Partial<Rule>) => void
  onDeleteRule: (ruleId: string) => void
}
```

---

## Storage Format (localStorage)

The entire application state is serialized to JSON in localStorage:

```typescript
interface AppState {
  columns: Column[]
  rules: Rule[]
}

// Stored as: localStorage.setItem("kanban-state", JSON.stringify(state))
```

---

## ID Generation

Use the `generateId()` utility function from `lib/utils.ts`:

```typescript
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Returns: string like "abc1def2" (7-8 random characters)
// Usage: `task-${generateId()}` → "task-abc1def2"
```

---

## Null/Undefined Handling

- **dueDate**: Use `null`, not `undefined` (explicitly checked with `task.dueDate !== null`)
- **description**: Optional in interface, but if present should be a non-empty string
- **customFields/subtasks**: Always arrays (never null), may be empty `[]`
- **color**: Optional in Column interface, undefined if not set

---

## Validation Rules

When creating or updating types:

- **Task.id**: Must be unique across all tasks
- **Task.status**: Should match a column title for proper automation
- **Task.dueDate**: Must be valid ISO 8601 string or null
- **Column.id**: Must be unique across all columns
- **CustomField.name**: Should not be empty
- **Rule.id**: Must be unique across all rules
- **RuleCondition.field**: Required when type is "custom-field"

---

## Type Extensions

The types are designed to be extensible:

1. **New Rule Actions**: Add new action type to `RuleAction.type` union and handle in automation processor
2. **New Condition Types**: Add to `RuleCondition.type` union and implement evaluation logic
3. **New Operators**: Add to `RuleCondition.operator` union and implement comparison logic
4. **New Custom Fields**: Add to task's customFields array (no schema changes needed)

---

For file structure and usage examples, see [INDEX.md](INDEX.md).
For implementation details, see [ARCHITECTURE.md](ARCHITECTURE.md).
