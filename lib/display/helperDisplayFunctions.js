import React from "react";

import { ImBook } from "react-icons/im";
import { IoIosBook } from "react-icons/io";
import { MdBookmark } from "react-icons/md";

export function authorsShow(authors, onChangeQuery){
    return(
    <>
      {authors.map((item, index) => (
        <span
          className={
            "text-green-600 cursor-pointer hover:underline hover:text-green-700 mr-1"
          }
          onClick={() => onChangeQuery(item)}
        >
          {index === authors.length - 1 ? item : item + ","}
        </span>
      ))}
    </>
  );
}
  
  export function documentIcon(item) {
    switch (item) {
      case "Blog Post":
        return <MdBookmark />;
      case "Book":
        return <ImBook />;
      default:
        return <IoIosBook />;
    }
  }