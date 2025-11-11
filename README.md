# MBAM Organizer

A beautiful, modern Kanban board for production line content management built with Next.js, React, and Tailwind CSS.

## Features

- **Drag-and-Drop Kanban Board**: Organize tasks across multiple columns
- **Task Management**: Create, edit, and delete tasks with rich details
- **Subtasks**: Break down work into smaller steps with completion tracking
- **Custom Fields**: Add custom metadata to tasks
- **Due Dates**: Track task deadlines with visual indicators for overdue items
- **Dark Mode**: Full dark mode support with persistent theme preference
- **Persistent Storage**: All data saved locally in browser storage
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Next.js 16.0.1** - React framework with Turbopack
- **TypeScript 5.7** - Type-safe development
- **React 18** - UI framework
- **Tailwind CSS v3** - Utility-first styling
- **@hello-pangea/dnd** - Drag-and-drop functionality
- **next-themes** - Dark mode management
- **lucide-react** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
│
├── components/            # React components
│   ├── kanban-board.tsx   # Main Kanban component
│   ├── column.tsx         # Column with drag-drop
│   ├── task-card.tsx      # Task display card
│   ├── task-detail-sidebar.tsx  # Task editor
│   ├── theme-toggle.tsx   # Dark mode button
│   ├── providers.tsx      # Theme provider
│   └── ui/               # Reusable UI components
│
├── types/
│   └── kanban.ts         # TypeScript interfaces
│
└── lib/
    └── utils.ts          # Utility functions
```

## Documentation

See [.claude-docs/](./claude-docs/) for comprehensive documentation:

- [FEATURES_COMPLETE.md](./.claude-docs/FEATURES_COMPLETE.md) - Complete feature list and testing checklist
- [ARCHITECTURE.md](./.claude-docs/ARCHITECTURE.md) - Detailed architecture and patterns
- [TYPE_DEFINITIONS.md](./.claude-docs/TYPE_DEFINITIONS.md) - TypeScript type reference
- [INDEX.md](./.claude-docs/INDEX.md) - Component mappings and overview

## Usage

### Creating Tasks

1. Click on any column header area to see the task input
2. Enter task title and description
3. Click "Add" to create the task

### Managing Tasks

- **Click a task card** to open the detail sidebar
- **Edit details**: Title, description, due date, subtasks, custom fields
- **Drag tasks** between columns to update status
- **Duplicate tasks** from the detail sidebar
- **Delete tasks** using the delete button

### Dark Mode

Click the theme toggle button (moon/sun icon) in the top-right corner to switch between light and dark modes. Your preference is saved automatically.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires JavaScript enabled

## Known Limitations

- Data is stored locally in the browser (no cloud sync)
- Single-user only (no collaboration features yet)
- localStorage limit applies (usually 5-10MB)

## Future Enhancements

- Cloud/database backend integration
- User authentication and collaboration
- Automation rules for task workflows
- Team workspaces
- Activity history and undo/redo
- Export to various formats

## Development

### Building

```bash
npm run build  # Create optimized production build
```

### Code Quality

```bash
# TypeScript strict checking
npm run build  # Includes type checking

# Linting (if configured)
npm run lint
```

## License

MIT

## Contributing

This project was built with Claude Code.

---

**Version**: 1.0.0
**Last Updated**: November 2025
