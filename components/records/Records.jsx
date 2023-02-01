import React from 'react'
import { ArrowDownCircleIcon, TrashIcon } from '@heroicons/react/24/solid'

export default function Records({ records }) {
  return (
    <main className="space-y-12 mx-4 md:mx-24 flex flex-row">
      <table className="table-auto">
        <thead>
          <tr>
            <th>Load</th>
            <th>Name</th>
            <th># breakpoints</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(records).map(key => {
            const record = records[key];
            return (
              <tr key={key}>
                <td>
                  <button
                    className="mx-1 py-2 px-4 border rounded"
                    onClick={record.loadFn}>
                    <ArrowDownCircleIcon className="h-6 w-6 text-gray-400 hover:text-indigo-500" />
                  </button>
                </td>
                <td>{record.name}</td>
                <td>{record.breakpoints.length}</td>
                <td>
                  <button
                    className="mx-1 py-2 px-4 border rounded"
                    onClick={record.removeFn}>
                    <TrashIcon className="h-6 w-6 text-gray-400 hover:text-indigo-500" />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}
