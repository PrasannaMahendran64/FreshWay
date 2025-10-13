import React from "react";

export default function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="text-left px-6 py-3 border-b border-gray-300 text-gray-700 font-semibold uppercase text-sm"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={`transition-all duration-300 ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-green-50`}
            >
              {columns.map((col, cidx) => (
                <td
                  key={cidx}
                  className="px-6 py-3 border-b border-gray-200 text-gray-700"
                >
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
