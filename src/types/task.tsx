export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  assignedTo: string  // user ID
  createdAt: Date
}
