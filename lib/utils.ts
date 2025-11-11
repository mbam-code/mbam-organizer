export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function isOverdue(dueDate: string | null, status: string): boolean {
  if (!dueDate || status === "Completed") return false
  return new Date(dueDate) < new Date()
}
