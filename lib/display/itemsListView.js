import React from "react";
import { AiFillStar } from "react-icons/ai";
import { authorsShow, documentIcon} from "./helperDisplayFunctions.js";

export default function ItemsListView(props) {
    const { id, item, score, onChangeQuery, setSelected, isSelected } = props;
    const {
      title,
    } = item;
    return (
      <tr
        key={id}
        className={`hover:bg-denim-100 cursor-pointer border-b border-gray-300 ${
          isSelected ? "bg-denim-100" : ""
        }`}
        onClick={(e) => {
          setSelected();
        }}
      >
        <td className="px-4 py-4">
          <div>
            <div className="text-lg text-gray-800">{title}</div>
          </div>
        </td>
        <td className="px-2 text-gray-400">{(score * 100).toFixed(0)}</td>
      </tr>
    );
  }