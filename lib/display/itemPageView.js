import React from "react";
import { markdownRenderer } from "./markdownRenderer.js";
import { authorsShow, documentIcon } from "./helperDisplayFunctions.js";
import { AiFillStar } from "react-icons/ai";
import { FaUniversity } from "react-icons/fa";

let formatNumber = (numText) => numText ? " #" + numText.replace("#", "") : ""
let blurb = ({ sourceName, sourceLink, isStarred, blurb }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md mb-6">
      <div className="border-b border-gray-200 px-4 py-3 flex justify-between">
        <div className="flex justify-start items-center text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="flex-shrink-0 w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1 ml-2 text-sm font-bold"> {sourceName}</div>
        </div>
        <a
          href={sourceLink}
          className="justify-end flex items-center text-gray-400 hover:underline hover:text-gray-500"
          target="_blank"
        >
          <div className="flex-1 mr-1 text-sm">Link</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="flex-shrink-0 w-5 h-4"
          >
            <path
              fillRule="evenodd"
              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
      {isStarred && (
        <div className="border-b border-gray-200 bg-yellow-50 px-4 pt-2 pb-1">
          <span className="inline-flex items-center text-yellow-500">
            <span className="text-yellow-500 text-md mr-2">
              <AiFillStar />
            </span>
            <span className="text-sm font-bold">Highlight</span>
          </span>
        </div>
      )}
      <div className="prose p-4 bg-neutral-100 text-neutral-600 mt-1 mb-2 max-w-5xl text-gray-700">
        <div dangerouslySetInnerHTML={{ __html: markdownRenderer(blurb) }} />
      </div>
    </div>
  );
};

export default function ItemPageView({
  id,
  title,
  author,
  anBlurb,
  anHighlightFlag,
  anNewsletterNumber,
  anNewsletterLink,
  jeremyBlurb,
  publicationYear,
  orgs,
  publicationTitle,
  abstractNote,
  itemType,
  safetyType,
  onChangeQuery,
  url
}) {
  let tagCss = (icon, title) =>
    title && (
      <div
        className="mt-2 flex items-center text-sm text-gray-500 cursor-pointer hover:text-gray-500 bg-gray-100 rounded-sm px-4 py-2 hover:bg-gray-300"
        onClick={() => onChangeQuery(title)}
      >
        {icon && <span className="inline-block text-md mr-2">{icon}</span>}
        {title}
      </div>
    );
  return (
    <div key={id} className="container mx-auto pt-10 max-w-5xl">
      <h2 className="pb-2 text-gray-900 text-3xl">
        <a href={url} target="_blank">
          {title}
        </a>
      </h2>
      <div className="pb-4">
        {authorsShow(author, onChangeQuery)}
        <span className="text-gray-400">{publicationYear ? `(${publicationYear})` : ""}</span>
      </div>
      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-3 pb-8">
        {tagCss(documentIcon(itemType), itemType)}
        {orgs.map((item) => tagCss(<FaUniversity />, item))}
        {tagCss(false, publicationTitle)}
        {tagCss(false, safetyType)}
      </div>
      <div className="text-gray-400 pb-2 italic">
        <a href={url} target="_blank">
          {url}
        </a>
      </div>
      {abstractNote && (
        <div className="prose text-gray-700 bg-neutral-100 text-neutral-600 mt-4 mb-5 max-w-5xl">
          {abstractNote && (
            <div
              dangerouslySetInnerHTML={{
                __html: markdownRenderer(abstractNote)
              }}
            />
          )}
        </div>
      )}

      {anBlurb &&
        blurb({
          sourceName: "Alignment Newsletter" + formatNumber(anNewsletterNumber),
          sourceLink: (anNewsletterLink && anNewsletterLink != "N/A" ) ? anNewsletterLink : "https://rohinshah.com/alignment-newsletter/",
          isStarred: anHighlightFlag,
          blurb: anBlurb
        })}
      {jeremyBlurb &&
        blurb({
          sourceName: "Jérémy Perret",
          sourceLink:
            "https://www.lesswrong.com/posts/4az2cFrJp3ya4y6Wx/resources-for-ai-alignment-cartography",
          isStarred: false,
          blurb: jeremyBlurb
        })}
    </div>
  );
}
