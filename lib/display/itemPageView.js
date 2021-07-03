import React from "react";
import { markdownRenderer } from "./markdownRenderer.js";
import { authorsShow, documentIcon} from "./helperDisplayFunctions.js";
import { AiFillStar } from "react-icons/ai";
import { FaUniversity } from "react-icons/fa";

export default function ItemPageView({
    id,
    title,
    genericMarkdownContent,
    url,
  }){
  let tagCss = (title) =>
    title && (
      <div
        className="mt-2 flex items-center text-sm text-gray-500 cursor-pointer hover:text-gray-500 bg-gray-100 rounded-sm px-4 py-2 hover:bg-gray-300"
        onClick={() => onChangeQuery(title)}
      >
        {title}
      </div>
    );
  return (
    <div key={id} className="container mx-auto pt-10 max-w-5xl">
      <h2 className="pb-2 text-gray-900 text-3xl">
        <a href={url} target="_blank">{title}</a>
      </h2>
      <div className="text-gray-400 pb-2 italic">
        <a href={url} target="_blank">{url}</a>
      </div>
      {genericMarkdownContent && (
        <div className="prose text-gray-700 bg-neutral-100 text-neutral-600 mt-4 mb-5 max-w-5xl">
          {genericMarkdownContent && (
            <div
              dangerouslySetInnerHTML={{ __html: markdownRenderer(genericMarkdownContent) }}
            />
          )}
        </div>
      )}
    </div>
  );
};
  