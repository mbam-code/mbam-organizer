# MBAM Organizer - Reference Code Index

This folder contains all reference code from the original MBAM Organizer implementation. These files document the architectural patterns, component structure, and design specifications that inform the new build.

## File Structure & Purposes

### Core Type Definitions
- **kanban.ts** - Type definitions for the entire application
  - `Task` - Individual task/card interface with title, description, due date, subtasks, custom fields
  - `Subtask` - Sub-items within a task with completion status
  - `CustomField` - Dynamic fields that can be added to tasks (Priority, Assigned To, Story Points, etc.)
  - `Column` - Kanban column with title, tasks array, and optional color
  - `Rule` - Automation rule for moving tasks based on conditions
  - `RuleCondition` - Condition types (due-date, subtasks-completed, custom-field)
  - `RuleAction` - Action to execute when rule condition is met (move-to-column)

### Utility Functions
- **utils.ts** - Helper functions
  - `cn()` - Tailwind class merging utility
  - `generateId()` - Creates unique IDs using Math.random()
  - `formatDate()` - Converts ISO date strings to readable format (e.g., "Nov 11, 2024")

### Component Hierarchy

#### Main Container
- **kanban-board.tsx** - Central orchestrator component
  - Manages all application state (columns, tasks, rules, automation)
  - Handles DragDropContext for drag-and-drop functionality
  - Implements task CRUD operations (Create, Read, Update, Delete)
  - Generates mock data for initial state
  - Has two tabs: "Board" (main kanban view) and "Automation" (rules management)
  - Persists state to localStorage
  - Key methods:
    - `handleDragEnd()` - Processes drag-drop results, moves tasks between columns
    - `addTask()`, `updateTask()`, `deleteTask()` - Task management
    - `duplicateTask()` - Creates copy of existing task
    - `addColumn()` - Adds new column to board
    - `processAutomationRules()` - Evaluates and applies automation rules

#### Column Component
- **column.tsx** - Individual column in the kanban board
  - Displays column header with task count badge
  - Renders all tasks as draggable cards
  - Implements drop zone for receiving dragged tasks
  - "Add Task" button with inline form (title + description)
  - Column color customization via Popover color picker (8 colors available)
  - Column deletion via dropdown menu
  - Props:
    - `column` - Column data with tasks array
    - `onAddTask` - Callback to add new task to this column
    - `onTaskClick` - Callback when task is clicked (opens detail sidebar)
    - `onDeleteColumn` - Callback to delete this column
    - `onUpdateColumn` - Callback to update column properties (like color)
    - `onDuplicateTask` - Callback to duplicate a task

#### Task Card Component
- **task-card.tsx** - Individual task card displayed in columns
  - Shows task title, description (truncated to 2 lines)
  - Displays due date with Calendar icon (red if overdue)
  - Shows subtask progress (e.g., "2/4" completed)
  - Displays custom fields dynamically (truncated to 10 chars)
  - Duplicate button appears on hover
  - Props:
    - `task` - Task data object
    - `onClick` - Callback to open task detail sidebar
    - `onDuplicate` - Callback to duplicate task

### Detail & Editing
- **task-detail-sidebar.tsx** - Side panel for editing task details
  - Full task editing interface
  - Subtask management (add, delete, toggle completion)
  - Custom field management (add, delete)
  - Due date picker
  - Notes/description editing
  - Delete and duplicate task operations
  - Updates parent via `onUpdate` callback

### Advanced Features
- **automation-rules.tsx** - Automation rule management
  - Create and edit automation rules
  - Condition builders for:
    - Due date checks (is-overdue, days-until)
    - Subtask completion (all-completed, percentage)
    - Custom field values (equals, contains, is-empty, etc.)
  - Actions (currently: move-to-column)
  - Enable/disable rules toggle
  - Delete rules

### Theme & UI
- **theme-toggle.tsx** - Light/dark mode switcher
  - Simple button interface (Light / Dark)
  - Uses next-themes for persistence
  - No "System" option per user specification

### Pages
- **page.tsx** (two versions) - Main application page
  - Client component that imports and renders KanbanBoard
  - Sets up app layout and styling
  - Integrates ThemeProvider for dark mode support

---

## Key Architectural Patterns

### State Management
- Central state in KanbanBoard component using `useState`
- State includes:
  - `columns[]` - Array of all columns with their tasks
  - `tasks` - Current selected/editing task
  - `rules[]` - Automation rules
- Local storage for persistence (key: "kanban-state")

### Data Flow
1. User interacts with TaskCard/Column
2. Component calls parent callback (e.g., `onTaskClick`)
3. KanbanBoard updates state
4. Components re-render with new data
5. State saved to localStorage

### Drag-Drop Implementation
- Uses `@hello-pangea/dnd` library (not react-beautiful-dnd)
- `DragDropContext` wraps entire board
- Each column is a `Droppable` zone
- Each task is a `Draggable` item
- `handleDragEnd()` processes drop results and moves tasks

### Column Color System
```javascript
const COLUMN_COLORS = [
  { name: "Default", value: "bg-white dark:bg-gray-800" },
  { name: "Blue", value: "bg-blue-50 dark:bg-blue-900/30" },
  { name: "Green", value: "bg-green-50 dark:bg-green-900/30" },
  // ... 5 more colors
]
```
- Each color has light and dark mode variants
- Applied to column header background
- Stored in column's `color` property

### Task Data Structure
```typescript
{
  id: "task-abc123",
  title: "Task title",
  description: "Task description",
  status: "Column Title", // Matches column title
  dueDate: "2024-11-15T00:00:00.000Z" or null,
  subtasks: [
    { id: "sub-123", title: "Subtask 1", completed: false },
    // ...
  ],
  customFields: [
    { id: "field-1", name: "Priority", value: "High" },
    // ...
  ],
  createdAt: "2024-11-08T00:00:00.000Z"
}
```

---

## Implementation Notes for New Build

### Critical Dependencies
- `@hello-pangea/dnd@16.6.0` - Drag-drop (must use legacy-peer-deps with React 19)
- `lucide-react@0.263.1` - Icons (Calendar, CheckSquare, Copy, Plus, etc.)
- `next-themes@0.2.1` - Theme management
- `tailwindcss@3.4.1` - Styling with dark mode support

### Component Import Patterns
- All components are "use client" (client-side)
- Uses Shadcn UI components (Button, Input, Textarea, Dropdown, Popover, Tabs)
- Assumes components exist in `@/components/ui/` directory
- Uses @/lib/utils for utility functions
- Uses @/types/kanban for type definitions

### Styling Approach
- Tailwind CSS v3 with dark mode support
- Responsive design with fixed column widths (w-72)
- Hover effects on cards and buttons
- Smooth transitions for all interactive elements
- Shadow effects for depth (shadow-sm, shadow-md, shadow-lg)

### Mock Data Strategy
- `generateMockTasks()` creates realistic sample data
- Dates are relative (e.g., 5 days from now, 1 day ago)
- Includes variety of tasks in different stages
- Demonstrates all features (subtasks, custom fields, due dates)

### Automation Rule Processing
- Rules checked whenever relevant task/column state changes
- Conditions evaluated with flexible operators
- Can auto-move tasks based on multiple rule types
- Extensible action system (ready for more actions beyond move-to-column)

---

## Next Steps for Implementation

1. **Set up component structure** - Create components/ui/ directory with required UI components
2. **Implement types** - Create types/kanban.ts with all interfaces from this reference
3. **Build core Kanban** - Implement KanbanBoard with state management
4. **Add columns and tasks** - Implement Column and TaskCard components
5. **Enable drag-drop** - Integrate @hello-pangea/dnd
6. **Add detail editing** - Implement TaskDetailSidebar
7. **Polish UI** - Apply Tailwind styling and animations
8. **Implement automation** - Add AutomationRules when core features work
9. **Add theme toggle** - Integrate next-themes for dark mode
10. **Set up persistence** - Implement localStorage save/load

---

## Design Principles Observed

1. **User-centric** - Clean, minimal UI focusing on content
2. **Responsive** - Works on different screen sizes
3. **Accessible** - Proper labels, keyboard support, ARIA attributes
4. **Dark mode first** - Colors have light and dark variants
5. **Extensible** - Custom fields, automation rules, column colors
6. **Fast feedback** - Instant visual feedback on interactions
7. **Beautiful animations** - Smooth transitions, drag effects

---

Generated from original MBAM Organizer reference code for context preservation.
