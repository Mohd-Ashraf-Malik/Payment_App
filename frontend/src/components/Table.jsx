import React from "react"
function TableRows({rowData}){
    return (
        <tr className="odd:bg-white even:bg-gray-50 border-b">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {rowData._id}
                        </th>
                        <td className="px-6 py-4">
                            {rowData.from}
                        </td>
                        <td className="px-6 py-4">
                            {rowData.to}
                        </td>
                        <td className="px-6 py-4">
                            {rowData.amount}
                        </td>
                        <td className="px-6 py-4">
                            {rowData.timestamp}
                        </td>
                    </tr>
    )
}

function TableHeader({ header }){
    return (
        
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                       { header.map((name,index) => (
                            <th key={index} scope="col" className="px-6 py-3">
                                {name}
                            </th>
                        ))}
                    </tr>
                </thead>
    )
}



export function Table({tableHeader,tableRows}){
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <TableHeader header={tableHeader}/>
                <tbody>
                    {tableRows.map((row,index)=>(
                        <TableRows key={index} rowData={row}/>
                    ))}
                </tbody>
            </table>
        </div>
    )
}