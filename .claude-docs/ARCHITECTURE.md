# MBAM Organizer - Architecture & Implementation Guide

Complete architectural documentation for building the Kanban board application.

## Application Structure

### Component Hierarchy

```
RootLayout (app/layout.tsx)
└── Home/Page (app/page.tsx) - "use client"
    └── KanbanBoard (main component)
        ├── Header
        │   ├── Title & Description
        │   └── ThemeToggle
        ├── Tabs (Board | Automation)
        │   ├── TabsContent: Board
        │   │   ├── DragDropContext
        │   │   │   └── Column[] (mapped)
        │   │   │       ├── Droppable
        │   │   │       │   ├── Draggable[] (tasks)
        │   │   │       │   │   └── TaskCard
        │   │   │       │   └── AddTaskForm
        │   │   │       └── ColumnMenu (color picker, delete)
        │   │   └── AddColumnButton
        │   └── TabsContent: Automation
        │       └── AutomationRules
        └── TaskDetailSidebar (modal-like overlay)
            ├── TaskForm (title, description)
            ├── SubtaskManager
            ├── CustomFieldManager
            ├── DueDatePicker
            └── ActionButtons (save, delete, duplicate)
```

---

## State Management Strategy

### Global Application State (KanbanBoard Component)

```typescript
const [columns, setColumns] = useState<Column[]>([
  // Initial columns
  { id: "col-1", title: "To Do", tasks: [], color: undefined },
  { id: "col-2", title: "In Progress", tasks: [], color: undefined },
  { id: "col-3", title: "Completed", tasks: [], color: undefined },
])

const [selectedTask, setSelectedTask] = useState<Task | null>(null)
const [rules, setRules] = useState<Rule[]>([])
```

### Local Component State

- **Column Component**: `isAddingTask`, `newTaskTitle`, `newTaskDescription`
- **TaskDetailSidebar**: Edit form state (title, description, subtasks, custom fields, due date)
- **AutomationRules**: Form state for rule creation/editing

### Derived State

- **Completed/Total Subtasks** (TaskCard): Calculated from task.subtasks array
- **Is Overdue** (TaskCard): Calculated by comparing dueDate to current date
- **Column Count** (Column): Derived from column.tasks.length

---

## Data Flow Patterns

### Pattern 1: Task Creation

```
User clicks "Add Task" in column
  ↓
setIsAddingTask(true) - renders form
  ↓
User enters title + description
  ↓
handleAddTask()
  ↓
Create new Task object with generateId()
  ↓
onAddTask(columnId, newTask) - callback to parent
  ↓
KanbanBoard.addTask() updates state
  ↓
setColumns([...]) - new column with updated tasks
  ↓
Component re-renders with new task visible
```

### Pattern 2: Task Editing

```
User clicks task card
  ↓
TaskCard onClick → onTaskClick(task)
  ↓
KanbanBoard.setSelectedTask(task)
  ↓
TaskDetailSidebar renders with task data
  ↓
User edits title, description, subtasks, etc.
  ↓
User clicks Save
  ↓
onUpdate(updates) - callback to parent
  ↓
KanbanBoard.updateTask(taskId, updates)
  ↓
Find task in columns array and update it
  ↓
setColumns([...]) - trigger re-render
  ↓
TaskDetailSidebar closes (setSelectedTask(null))
```

### Pattern 3: Drag & Drop

```
User drags task card
  ↓
@hello-pangea/dnd DragDropContext captures event
  ↓
onDragEnd(result: DropResult)
  ↓
handleDragEnd() processes result
  ↓
Extract source column, destination column, task
  ↓
If task moved to different column:
   - Remove task from source column's tasks array
   - Add task to destination column's tasks array
   - Update task.status to destination column title
  ↓
If dragging within same column:
   - Reorder tasks array based on index
  ↓
setColumns([...]) - new columns array
  ↓
Evaluate automation rules (processAutomationRules)
  ↓
Save to localStorage
```

### Pattern 4: Automation Rule Processing

```
State changes occur (task created, moved, updated)
  ↓
processAutomationRules()
  ↓
For each rule where enabled === true:
  ├─ Get condition and action
  ├─ Evaluate condition against all tasks:
  │  ├─ Check each task
  │  ├─ Check if condition matches (due-date, subtasks, custom-field)
  │  └─ Collect matching tasks
  ├─ Execute action for each match:
  │  └─ Move task to targetColumnId
  └─ If any tasks moved:
     └─ Update columns and tasks state
  ↓
Rules continue to update, no circular loop (rule only moves once per condition eval)
```

---

## Key Functions Explained

### KanbanBoard Functions

#### addTask(columnId: string, task: Task)
```typescript
// Find column by id
// Add task to its tasks array
// Save to localStorage
// Evaluate automation rules
```

#### updateTask(taskId: string, updates: Partial<Task>)
```typescript
// Search all columns for task by id
// Update task with new values
// If status changed, move to appropriate column
// Save to localStorage
// Evaluate automation rules
```

#### deleteTask(taskId: string)
```typescript
// Search all columns for task by id
// Remove task from its column's tasks array
// Save to localStorage
```

#### duplicateTask(task: Task, sourceColumnId: string)
```typescript
// Create new task with same properties
// Generate new id and createdAt
// Add to source column (or could be to different column)
// Save to localStorage
```

#### addColumn(column: Column)
```typescript
// Add new column to columns array
// Column needs unique id and title
// tasks array starts empty
// Save to localStorage
```

#### deleteColumn(columnId: string)
```typescript
// Find all tasks in column
// Move them to default column (usually "To Do") or handle differently
// Remove column from columns array
// Save to localStorage
```

#### handleDragEnd(result: DropResult)
```typescript
// Extract: source, destination, draggableId from result
// If dropped outside any zone: do nothing
// Find task by draggableId
// Find source and destination columns
// Update task status to destination column title
// Move task from source to destination tasks array
// If reordering within column: reorder tasks array
// Update state with setColumns()
// Process automation rules
// Save to localStorage
```

#### processAutomationRules()
```typescript
// Loop through each rule
// If rule.enabled === false: skip
// Evaluate rule.condition against all tasks
// For each matching task:
//   - Apply rule.action (move to targetColumnId)
//   - Update task.status to match column title
// Update state if any tasks moved
// Prevent infinite loops (each rule processes once per call)
```

---

## localStorage Persistence

### Storage Key
```typescript
const STORAGE_KEY = "kanban-state"
```

### Stored Structure
```typescript
const state = {
  columns: Column[],
  rules: Rule[],
}

localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
```

### Load on App Start
```typescript
useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const { columns, rules } = JSON.parse(saved)
    setColumns(columns)
    setRules(rules)
  }
}, [])
```

### Save After Each Change
```typescript
// Every action that modifies state also does:
localStorage.setItem(STORAGE_KEY, JSON.stringify({
  columns,
  rules,
}))
```

---

## Drag & Drop Implementation

### @hello-pangea/dnd Setup

```typescript
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

// Wrap entire board in DragDropContext
<DragDropContext onDragEnd={handleDragEnd}>
  {columns.map(column => (
    // Each column is a Droppable with unique ID
    <Droppable droppableId={column.id} key={column.id}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {column.tasks.map((task, index) => (
            // Each task is Draggable with unique ID
            <Draggable draggableId={task.id} index={index} key={task.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                  <TaskCard {...taskProps} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  ))}
</DragDropContext>
```

### DropResult Structure
```typescript
interface DropResult {
  draggableId: string        // task.id of dragged item
  type: string               // usually "DEFAULT"
  source: {
    droppableId: string      // source column.id
    index: number            // position in source column
  }
  destination: {
    droppableId: string      // destination column.id (or null if dropped outside)
    index: number            // position in destination column
  }
}
```

### handleDragEnd Implementation
```typescript
const handleDragEnd = (result: DropResult) => {
  const { source, destination, draggableId } = result

  // No valid destination
  if (!destination) return

  // Same position
  if (source.droppableId === destination.droppableId &&
      source.index === destination.index) return

  // Find task
  const task = columns
    .flatMap(col => col.tasks)
    .find(t => t.id === draggableId)
  if (!task) return

  // Create new columns array
  const newColumns = columns.map(col => {
    const newTasks = [...col.tasks]

    // Remove from source
    if (col.id === source.droppableId) {
      newTasks.splice(source.index, 1)
    }

    // Add to destination
    if (col.id === destination.droppableId) {
      task.status = col.title  // Update task status
      newTasks.splice(destination.index, 0, task)
    }

    return { ...col, tasks: newTasks }
  })

  setColumns(newColumns)
  processAutomationRules()
  saveToStorage()
}
```

---

## UI Component Libraries

### Shadcn UI Components Used
- `Button` - Buttons with variants (ghost, outline, default)
- `Input` - Text input fields
- `Textarea` - Multi-line text areas
- `Label` - Form labels
- `Tabs` - Tab interface (Board | Automation)
- `Dropdown Menu` - Context menus (delete column, task actions)
- `Popover` - Color picker (column colors)
- `Dialog` or `AlertDialog` - Confirmation dialogs
- `DatePicker` - Due date selection

### Lucide React Icons Used
- `Plus` - Add buttons
- `Trash2` - Delete actions
- `Palette` - Color picker
- `MoreHorizontal` - More options menu
- `Calendar` - Due date indicator
- `CheckSquare` - Subtask progress
- `Copy` - Duplicate task
- `Moon` / `Sun` - Theme toggle

### Tailwind CSS Patterns

#### Colors with Dark Mode
```html
<!-- Text -->
<div class="text-gray-700 dark:text-gray-200">Text</div>

<!-- Backgrounds -->
<div class="bg-gray-50 dark:bg-gray-900">Background</div>

<!-- Borders -->
<div class="border dark:border-gray-700">Border</div>

<!-- With opacity -->
<div class="bg-blue-50 dark:bg-blue-900/30">Light background</div>
```

#### Layout Classes
```html
<!-- Flexbox -->
<div class="flex gap-2 items-center">...</div>
<div class="flex justify-between">...</div>

<!-- Grid -->
<div class="grid grid-cols-4 gap-2">...</div>

<!-- Spacing -->
<div class="p-3 mb-2 mt-4">...</div>

<!-- Sizing -->
<div class="w-72 h-8">...</div>
<div class="min-h-screen">...</div>

<!-- Responsive -->
<div class="hidden sm:block">...</div>
```

#### Interactive Classes
```html
<!-- Hover -->
<button class="hover:shadow-md hover:opacity-80">Hover</button>

<!-- Transitions -->
<div class="transition-all duration-200">Animated</div>
<div class="transition-colors">Color animation</div>

<!-- Opacity -->
<div class="opacity-0 group-hover:opacity-100">Show on hover</div>

<!-- Rounded -->
<div class="rounded-md rounded-t-md rounded-lg">Rounded</div>
```

---

## Testing Strategies

### Unit Tests
- Task CRUD operations
- Column operations
- Automation rule evaluation
- Date formatting and validation
- ID generation uniqueness

### Integration Tests
- Drag and drop flow
- Task creation and editing
- Automation rules executing correctly
- localStorage save/load
- Column color customization

### E2E Tests
- Create task → Edit task → Delete task flow
- Drag task between columns
- Create automation rule → Task auto-moves
- Dark mode toggle persistence
- New session loads persisted state

### Edge Cases to Test
- Empty columns
- Task with no due date
- Task with 0/0 subtasks completed
- Deleting column with tasks
- Rule with no matching tasks
- Duplicate task ID (should not happen)
- Task moved to non-existent column (data corruption)
- localStorage disabled (graceful degradation)

---

## Performance Considerations

### Re-render Optimization
- Columns are independent (dragging one doesn't re-render others)
- TaskCard is simple and fast to render
- Use React.memo for TaskCard to prevent unnecessary re-renders
- Consider useCallback for event handlers

### localStorage Performance
- Only save on actual changes
- Could debounce saves if too frequent
- Consider compression if state gets very large
- Monitor for slow serialization/deserialization

### Array Operations
- Use spread operator for immutability
- Avoid mutating original arrays
- Consider useReducer for complex state updates

---

## Security Considerations

### Input Validation
- Validate task title is not empty
- Validate column title is not empty
- Sanitize custom field values (no HTML injection risk in current setup)
- Validate date inputs

### localStorage Security
- No sensitive data stored (all public/shareable)
- No credentials or tokens needed
- CORS not applicable (single-origin app)
- localStorage accessible to JavaScript (watch for XSS)

---

## File Organization

```
app/
├── layout.tsx           # Root layout, metadata
├── page.tsx             # Main page with KanbanBoard
└── globals.css          # Tailwind directives

components/
├── kanban-board.tsx     # Main component
├── column.tsx           # Column component
├── task-card.tsx        # Task card component
├── task-detail-sidebar.tsx  # Edit panel
├── automation-rules.tsx  # Automation UI
├── theme-toggle.tsx     # Light/dark toggle
└── ui/                  # Shadcn UI components
    ├── button.tsx
    ├── input.tsx
    ├── textarea.tsx
    ├── label.tsx
    ├── tabs.tsx
    ├── dropdown-menu.tsx
    ├── popover.tsx
    └── ... more UI components

lib/
└── utils.ts             # Utility functions (cn, generateId, formatDate)

types/
└── kanban.ts            # Type definitions

public/                  # Static assets (images, icons)

.claude-docs/           # Reference documentation (this folder)
├── INDEX.md            # Overview
├── TYPE_DEFINITIONS.md # Type reference
├── ARCHITECTURE.md     # This file
├── DESIGN_SPECS.md     # Design specifications
└── *.tsx files         # Reference components
```

---

## Deployment Considerations

- Build with `npm run build`
- Vercel: Auto-deploys main branch
- Environment variables: None needed (no backend)
- Static hosting: Can be deployed as static site
- PWA potential: Could add service worker for offline support
- GitHub backups: Optional (data stays in localStorage)

---

## Future Enhancements

1. **Backend Sync**: Connect to database for multi-device sync
2. **Real-time Collaboration**: WebSockets for live updates
3. **Advanced Filtering**: Filter tasks by status, due date, etc.
4. **Search**: Full-text search across tasks
5. **Export**: Export board as CSV, PDF, etc.
6. **Templates**: Save and reuse board templates
7. **History**: Undo/redo functionality
8. **Notifications**: Due date reminders
9. **Mobile App**: React Native version
10. **Team Workspace**: Multi-user with permissions

---

For complete type reference, see [TYPE_DEFINITIONS.md](TYPE_DEFINITIONS.md).
For design specifications, see [DESIGN_SPECS.md](DESIGN_SPECS.md).
For file overview, see [INDEX.md](INDEX.md).
