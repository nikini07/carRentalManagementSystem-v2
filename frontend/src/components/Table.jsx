// frontend/src/components/Table.jsx
import React from 'react';

const Table = ({ data, columns, onUpdate, onDelete }) => (
  <table className="w-full border-collapse border border-gray-300">
    <thead>
      <tr>
        {columns.map(col => <th key={col} className="border border-gray-300 p-2">{col}</th>)}
        {onUpdate && <th>Actions</th>}
      </tr>
    </thead>
    <tbody>
      {data.map((row, idx) => (
        <tr key={idx}>
          {columns.map(col => <td key={col} className="border border-gray-300 p-2">{row[col]}</td>)}
          {onUpdate && (
            <td className="border border-gray-300 p-2">
              <button onClick={() => onUpdate({ id: row.id || row.bookingID, field: prompt('Field?'), value: prompt('Value?') })} className="bg-yellow-500 text-white px-2 py-1 mr-1">Update</button>
              <button onClick={() => onDelete(row.id || row.bookingID)} className="bg-red-500 text-white px-2 py-1">Delete</button>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;