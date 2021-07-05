import React from "react";
import { AiFillStar } from "react-icons/ai";
import { authorsShow, documentIcon} from "./helperDisplayFunctions.js";

export default function ItemsListView(props) {
    const { id, item, score, onChangeQuery, setSelected, isSelected } = props;
    const {
      itemType,
      title,
      author,
      publicationYear,
      citations,
      anHighlightFlag,
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
            <div className="inline-flex items-center">
              {anHighlightFlag && (
                <span className="text-yellow-400 text-md mr-1">
                  <AiFillStar />
                </span>
              )}
              <span className="text-gray-400 text-md mr-1">
                {documentIcon(itemType)}
              </span>
              <span className="text-sm ml-1">
                {authorsShow(author.slice(0, 2), onChangeQuery)}
              </span>
            </div>
          </div>
        </td>
        <td className="px-2 text-gray-400">{publicationYear}</td>
        <td className="px-2 text-gray-400">
          {citations === "N/A" || citations === "N/F" || citations === "0"
            ? ""
            : citations}
        </td>
        <td className="px-2 text-gray-400">{(score * 100).toFixed(0)}</td>
      </tr>
    );
  }