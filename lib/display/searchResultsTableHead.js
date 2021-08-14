import React from "react";

export default function SearchResultsTableHead(){
    return(<thead className="">
    <tr>
      <th
        scope="col"
        className="px-4 py-1 text-left text-regular font-light text-gray-400"
      >
        Title
      </th>
      <th
        scope="col"
        className="px-2 py-1 text-left text-regular font-light text-gray-400"
      >
        Date
      </th>
      <th
        scope="col"
        className="px-2 py-1 text-left text-regular font-light text-gray-400"
      >
        Citations
      </th>
      <th
        scope="col"
        className="px-2 py-1 text-left text-regular font-light text-gray-400"
      >
        Distance
      </th>
    </tr>
  </thead>)
}