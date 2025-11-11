// src/app/page.tsx (or wherever your page component is)
import type { User } from '../types/user'

export default function Home() {
  const user: User = {
    id: '1',
    name: 'Aiswarya',
    email: 'aiswarya@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-blue-600">
        Welcome, {user.name}! 👋
      </h1>
      <p className="mt-2 text-gray-600">
        Your email: {user.email}
      </p>
      <p className="text-gray-400 text-sm">
        Member since: {user.createdAt.toDateString()}
      </p>
    </div>
  )
}
