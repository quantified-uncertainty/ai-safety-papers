import React, { useState } from "react";

export default function Form({ query, onChange, onArrowDown }) {
  const handleKeyPress = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      document.activeElement.blur();
      onArrowDown();
    }
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <form>
      <div className="block">
        <input
          placeholder="Search here..."
          className="mt-1 block w-full"
          type="text"
          onKeyDown={handleKeyPress}
          onChange={(e) => onChange(e.target.value)}
          name="query"
          label="Query"
        />
      </div>
    </form>
  );
}

{
  /* <div className="block">
        {check({
          value: values.typeBlogPost,
          name: "typeBlogPost",
          textName: "Blog Post",
        })}
        {check({
          value: values.typeManuscript,
          name: "typeManuscript",
          textName: "Manuscript",
        })}
        {check({
          value: values.typeConferencePaper,
          name: "typeConferencePaper",
          textName: "Conference Paper",
        })}
        {check({
          value: values.typeJournalArticle,
          name: "typeJournalArticle",
          textName: "Journal Article",
        })}
      </div> */
}
