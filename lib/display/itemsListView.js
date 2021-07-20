import React from "react";

export default function ItemsListView(props) {
    const { id, item, score, onChangeQuery, setSelected, isSelected } = props;
    const {
      title,
    } = item;
    return (
      <tr
        key={`${title}-${id}`}
        className={`hover:bg-denim-100 cursor-pointer border-b border-gray-300 ${
          isSelected ? "bg-denim-100" : ""
        }`}
        onClick={(e) => {
          setSelected();
        }}
      >
        <td className="px-4 py-4" key={"title"}>
            <div className="text-lg text-gray-800">{title}</div>
        </td>
        <td className="px-2 text-gray-400" key={"distance"}>{(score * 100).toFixed(0)}</td>
      </tr>
    );
  }