import React from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ Import this

const Tables = ({ title, headers, data, onEdit }) => {
    const navigate = useNavigate();

    const defaultEdit = (row) => {
        navigate("/edit-attendance", { state: { record: row } });
    };

    const handleEdit = (row) => {
        if (onEdit) {
            onEdit(row);
        } else {
            defaultEdit(row);
        }
    };

    const handleDelete = (row) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this row?");
        if (confirmDelete) {
            console.log("Deleted:", row);
            alert("Row deleted");
        }
    };

    return (
        <div className="my-8">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <div className="overflow-auto max-h-96 border rounded shadow">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-200">
                        <tr>
                            {headers.map((header, i) => (
                                <th key={i} className="px-4 py-2 border">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {headers.map((header, colIndex) => {
                                    if (header === "Actions") {
                                        return (
                                            <td key={colIndex} className="px-4 py-2 border space-x-2">
                                                <button
                                                    className="text-blue-600 hover:underline"
                                                    onClick={() => handleEdit(row)} // ⬅️ Updated
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-red-600 hover:underline"
                                                    onClick={() => handleDelete(row)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        );
                                    } else {
                                        return (
                                            <td key={colIndex} className="px-4 py-2 border">
                                                {row[header] ?? "-"}
                                            </td>
                                        );
                                    }
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Tables;
