# MBAM Organizer - Reference Documentation

This folder contains complete reference documentation and original source code for the MBAM Organizer Kanban board application. These files are preserved to maintain context across development sessions and prevent design drift.

## Documentation Files

### 📋 [INDEX.md](INDEX.md)
**Start here for overview and component mappings**
- File structure and purposes
- Component hierarchy diagram
- Key architectural patterns
- Column color system reference
- Task data structure examples
- Implementation notes for new build

### 📘 [TYPE_DEFINITIONS.md](TYPE_DEFINITIONS.md)
**Complete TypeScript interface reference**
- All required type definitions (Task, Column, Rule, etc.)
- Interface properties and their purposes
- Usage examples in components
- Mock data structure reference
- ID generation patterns
- localStorage format
- Validation rules

### 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md)
**Deep dive into component structure and data flow**
- Complete component hierarchy
- State management strategy
- Data flow patterns (4 main patterns documented)
- Key function explanations
- localStorage persistence implementation
- Drag-drop implementation details
- UI component library details
- Testing strategies
- Performance considerations

## Reference Source Code

All original component implementations from the v0.dev prototype:

### Core Components
- **kanban-board.tsx** - Main orchestrator component with state management
- **column.tsx** - Individual column implementation with color customization
- **task-card.tsx** - Task card display with badge information
- **task-detail-sidebar.tsx** - Full task editing interface
- **automation-rules.tsx** - Automation rules management UI
- **theme-toggle.tsx** - Light/dark mode switcher

### Utilities & Types
- **kanban.ts** - Type definitions (Task, Column, Rule, etc.)
- **utils.ts** - Utility functions (cn, generateId, formatDate)

### Pages
- **page.tsx** - App entry point examples

---

## How to Use This Documentation

### For New Build Implementation
1. Read [INDEX.md](INDEX.md) for component overview
2. Reference [TYPE_DEFINITIONS.md](TYPE_DEFINITIONS.md) when creating interfaces
3. Follow [ARCHITECTURE.md](ARCHITECTURE.md) for implementation patterns
4. Copy relevant code from component files as needed

### For Understanding Original Design
- Component files show working implementations of all features
- Type files define the complete data structure
- Architecture file explains the reasoning behind design decisions

### For Maintenance & Enhancement
- Reference files preserve design patterns for consistency
- Type definitions prevent regression in functionality
- Architecture patterns guide new feature implementation

---

## Key Design Patterns to Maintain

### 1. Component Structure
- "use client" directive on all interactive components
- Props interface defined above component function
- Callbacks passed down from parent (KanbanBoard)
- State managed at appropriate level (KanbanBoard for global state)

### 2. Data Management
- Immutable updates using spread operator
- localStorage synced after every state change
- Unique IDs using generateId() function
- ISO 8601 date strings for all date fields

### 3. Drag & Drop
- @hello-pangea/dnd library (compatible with React 19)
- DragDropContext wraps entire board
- Each column is Droppable, each task is Draggable
- Task status updated to match destination column title

### 4. Automation Rules
- Rules evaluated after state changes
- Condition-based task movement
- Flexible condition types and operators
- Extensible action system

### 5. UI/UX Principles
- Dark mode support on all components
- Tailwind v3 with light/dark variants
- Smooth transitions and hover effects
- Responsive layout with fixed column widths

---

## File Relationships

```
Documentation Flow:
README.md (you are here)
├── INDEX.md (overview)
├── TYPE_DEFINITIONS.md (types)
└── ARCHITECTURE.md (implementation)

Code Reference Flow:
Component Files
├── kanban-board.tsx (uses all types)
├── column.tsx (uses Task, Column types)
├── task-card.tsx (displays Task)
├── task-detail-sidebar.tsx (edits Task)
├── automation-rules.tsx (uses Rule types)
├── theme-toggle.tsx (no types)
└── page.tsx (entry point)

Supporting Files
├── kanban.ts (defines types)
└── utils.ts (utilities)
```

---

## Critical Context to Preserve

### Project Vision
- Production line content management system
- Beautiful Kanban board with smooth interactions
- Customizable columns with colors
- Task automation based on rules
- Light/dark mode support
- No backend required (localStorage persistence)

### Technology Stack
- Next.js 16 with Turbopack
- React 19
- TypeScript 5.7
- Tailwind CSS v3
- @hello-pangea/dnd for drag-drop
- Shadcn UI components
- Lucide React icons
- next-themes for dark mode

### Feature Set
- ✅ Kanban board with customizable columns
- ✅ Drag-drop task management
- ✅ Task creation, editing, deletion
- ✅ Subtasks with completion tracking
- ✅ Custom fields on tasks
- ✅ Due date with overdue detection
- ✅ Automation rules (task movement)
- ✅ Column color customization
- ✅ Light/dark mode toggle
- ✅ localStorage persistence
- 🔮 GitHub backups (planned)

---

## What NOT to Change

These architectural decisions should be maintained across sessions:

1. **Component Props Pattern** - Pass callbacks, not dispatch functions
2. **State in KanbanBoard** - Single source of truth
3. **Type Safety** - All types fully defined in kanban.ts
4. **Drag-Drop Library** - @hello-pangea/dnd is React 19 compatible
5. **Tailwind v3** - Use dark mode variants, not conditional rendering
6. **localStorage Key** - "kanban-state" for consistency
7. **ID Generation** - Use generateId() for consistency
8. **Column Colors** - 8-color palette with light/dark variants

---

## When Context is Lost

If you need to understand the original design:

1. Check this README first
2. Read INDEX.md for component overview
3. Look at reference component files for implementation details
4. Refer to TYPE_DEFINITIONS.md for data structures
5. Study ARCHITECTURE.md for design patterns

This documentation ensures the original vision is preserved even across context boundaries.

---

## Quick Reference

**To add a new feature:**
1. Define types in kanban.ts
2. Implement component following existing patterns
3. Add state management in KanbanBoard
4. Connect with callbacks
5. Test with mock data
6. Verify localStorage persistence

**To modify existing feature:**
1. Check type definitions first
2. Update types if needed
3. Find component in reference files
4. Follow existing patterns
5. Test edge cases
6. Verify no regressions

**To understand a pattern:**
1. Search ARCHITECTURE.md first
2. Look at example code in reference files
3. Check type definitions for data structure
4. Review component props interface

---

Generated: November 11, 2025
Purpose: Context preservation for MBAM Organizer development
Status: Reference documentation complete and ready for implementation
