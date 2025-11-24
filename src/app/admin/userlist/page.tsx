"use client"
import React, { useEffect, useState } from 'react'
type UserType = {
  id: number;
  name: string;
  email: string;
};

export default function Userlist() {

  const [users, setUser] = useState<UserType[]>([])

  const Fetchusers = async () => {
    try {
      const res = await fetch(`/api/users`)
      const data = await res.json()
      setUser(data.users) // make sure API returns { success, data: [...] }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    Fetchusers()
  }, [])

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden mt-10">
      <h2 className="text-xl font-semibold text-gray-800 px-6 py-4 border-b">
        User List
      </h2>

      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
          <tr>
            <th className="py-3 px-6">ID</th>
            <th className="py-3 px-6">Name</th>
            <th className="py-3 px-6">Email</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, i) => (
            <tr
              key={user.id}
              className={`hover:bg-gray-50 transition ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="py-3 px-6 text-gray-800">{user.id}</td>
              <td className="py-3 px-6 font-medium text-gray-900">{user.name}</td>
              <td className="py-3 px-6 text-gray-600">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
