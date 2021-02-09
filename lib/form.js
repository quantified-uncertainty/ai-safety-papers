import React, { useState } from "react";

export default function Form({ query, onChange, onArrowDown }) {
  const handleKeyPress = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      document.activeElement.blur();
      onArrowDown();
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let v = type === "checkbox" ? checked : value;
    onChange(newValues);
  };

  function check({ value, name, textName }) {
    return (
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          value={value}
          onChange={handleInputChange}
          name={name}
        />
        <span className="ml-2">{textName}</span>
      </label>
    );
  }

  return (
    <form>
      <div className="block">
        <input
          placeholder="Search here..."
          className="mt-1 block w-full"
          type="text"
          value={query}
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
