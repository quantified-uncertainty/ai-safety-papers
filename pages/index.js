import { getPapers } from "../lib/airtablegraph.js";
import Layout from "./layout.js";
import ReactMarkdown from "react-markdown";
import Fuse from "fuse.js";
import React, { useState, useEffect, useReducer } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import Form from "../lib/form.js";
import { BsFilePost } from "react-icons/bs";
import { HiDocument } from "react-icons/hi";
import { FaUniversity } from "react-icons/fa";
import { ImBook } from "react-icons/im";
import { IoIosBook } from "react-icons/io";
import { MdBookmark } from "react-icons/md";

export async function getStaticProps() {
  const { papers } = await getPapers();
  return {
    props: {
      items: papers,
    },
  };
}

let authorsShow = (authors, onChangeQuery) => (
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

function documentIcon(item) {
  switch (item) {
    case "Blog Post":
      return <MdBookmark />;
    case "Book":
      return <ImBook />;
    default:
      return <IoIosBook />;
  }
}

function PaperListView(props) {
  const { id, item, score, onChangeQuery, setSelected, isSelected } = props;
  const { itemType, title, author, publicationYear, citations } = item;
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
            <span className="text-gray-400 text-md mr-2">
              {documentIcon(itemType)}
            </span>
            <span className="text-sm">
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

let cleanMarkdown = (r) => r.replaceAll("\\", "");
let paperPageView = ({
  id,
  title,
  author,
  anBlurb,
  jeremyBlurb,
  publicationYear,
  orgs,
  publicationTitle,
  abstractNote,
  itemType,
  safetyType,
  onChangeQuery,
  url,
}) => {
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
        <a href={url}>{title}</a>
      </h2>
      <div className="pb-4">
        {authorsShow(author, onChangeQuery)}
        <span className="text-gray-400">({publicationYear})</span>
      </div>
      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-3 pb-8">
        {tagCss(documentIcon(itemType), itemType)}
        {orgs.map((item) => tagCss(<FaUniversity />, item))}
        {tagCss(false, publicationTitle)}
        {tagCss(false, safetyType)}
      </div>
      <div className="text-gray-400 pb-2 italic">
        <a href={url}>{url}</a>
      </div>
      {abstractNote && (
        <div className="prose text-gray-700 bg-neutral-100 text-neutral-600 mt-4 mb-5 max-w-5xl">
          <ReactMarkdown>
            {(abstractNote && cleanMarkdown(abstractNote)) || ""}
          </ReactMarkdown>
        </div>
      )}

      {anBlurb && (
        <div className="bg-gray-50 border border-gray-200 rounded-md">
          <div className="border-b border-gray-200 px-4 py-3 flex items-center text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="flex-shrink-0 w-5 h-5"
            >
              <path
                fill-rule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7"
                clip-rule="evenodd"
              />
            </svg>
            <div className="flex-1 ml-2 w-0 text-sm font-bold">
              {" "}
              Alignment Newsletter
            </div>
          </div>
          <div className="prose p-4 bg-neutral-100 text-neutral-600 mt-1 mb-2 max-w-5xl text-gray-700">
            <ReactMarkdown source={cleanMarkdown(anBlurb)} />
          </div>
        </div>
      )}
      {jeremyBlurb && (
        <div className="bg-gray-50 border border-gray-200 rounded-md">
          <div className="border-b border-gray-200 px-4 py-3 flex items-center text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="flex-shrink-0 w-5 h-5"
            >
              <path
                fill-rule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7"
                clip-rule="evenodd"
              />
            </svg>
            <div className="flex-1 ml-2 w-0 text-sm font-bold">Jeremy</div>
          </div>
          <div className="prose p-4 bg-neutral-100 text-neutral-600 mt-1 mb-2 max-w-5xl text-gray-700">
            <ReactMarkdown source={cleanMarkdown(jeremyBlurb)} />
          </div>
        </div>
      )}
    </div>
  );
};

const opts = {
  includeScore: true,
  keys: ["title", "author", "abstractNote", "publicationTitle", "orgs"],
};

const initialQuery = {
  query: "",
  typeBlogPost: true,
  typeManuscript: true,
  typeConferencePaper: true,
  typeJournalArticle: true,
  typeReport: true,
};

// TODO: use this for search:
// https://github.com/krisk/Fuse/search?q=%24and

const initialState = (items) => ({
  query: "",
  results: [],
  selectedId: false,
  selectedIndex: false,
  selectedResult: false,
  fuse: new Fuse(items, opts),
});

let decrement = (selectedIndex) => {
  switch (selectedIndex) {
    case false:
      return false;
    case 0:
      return false;
    default:
      return selectedIndex - 1;
  }
};

let increment = (selectedIndex, length) => {
  switch (selectedIndex) {
    case false:
      return 0;
    case length - 1:
      return selectedIndex;
    default:
      return selectedIndex + 1;
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "down": {
      const selectedIndex = increment(
        state.selectedIndex,
        state.results.length
      );
      return {
        ...state,
        selectedIndex,
        selectedResult: state.results[selectedIndex].item,
      };
    }
    case "setSelectedId":
      return {
        ...state,
        selectedId: action.id,
        selectedIndex: state.results.findIndex((e) => {
          return e.item.id == action.id;
        }),
        selectedResult: state.results.find((e) => {
          return e.item.id == action.id;
        }).item,
      };
    case "selectFirstIndex": {
      if (state.results.length > 0) {
        return {
          ...state,
          selectedIndex: 0,
          selectedResult: state.results[0].item,
        };
      } else {
        return state;
      }
    }
    case "up": {
      const selectedIndex = decrement(state.selectedIndex);
      state.selectedIndex === false || state.selectedIndex === -1
        ? -1
        : state.selectedIndex - 1;
      return {
        ...state,
        selectedIndex,
        selectedResult:
          state.results[selectedIndex] && state.results[selectedIndex].item,
      };
    }
    case "query":
      const results = state.fuse.search(action.query).slice(0, 40);
      return { ...state, query: action.query, results, selectedIndex: false };
    default:
      throw new Error();
  }
}

export default function Home({ items }) {
  const [state, dispatch] = useReducer(reducer, initialState(items));

  useHotkeys("down", (e) => {
    e.preventDefault();
    dispatch({ type: "down" });
  });
  useHotkeys("up", (e) => {
    e.preventDefault();
    dispatch({ type: "up" });
  });
  useHotkeys("o", (e) => {
    e.preventDefault();
    const win = window.open(state.selectedResult.url, "_blank");
  });

  let onChangeQuery = (query) => {
    dispatch({ type: "query", query });
  };
  let emptyDescription = (
    <div className="flex h-screen">
      <div className="mx-auto max-w-xs text-gray-500 text-center m-auto">
        <svg
          className="mx-auto"
          width="50"
          height="70"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.0491638 1C0.0491638 0.447715 0.496879 0 1.04916 0H36.6968C37.2491 0 37.6968 0.447715 37.6968 1V7.21099C37.6968 7.76327 37.2491 8.21099 36.6968 8.21099C36.1446 8.21099 35.6968 7.76327 35.6968 7.21099V2H2.04916V47.7808H35.6968V32.0464C35.6968 31.4942 36.1446 31.0464 36.6968 31.0464C37.2491 31.0464 37.6968 31.4942 37.6968 32.0464V48.7808C37.6968 49.3331 37.2491 49.7808 36.6968 49.7808H1.04916C0.496879 49.7808 0.0491638 49.3331 0.0491638 48.7808V1ZM28.899 10.4944C23.9198 10.4944 19.873 14.5571 19.873 19.5814C19.873 24.6058 23.9198 28.6685 28.899 28.6685C33.8781 28.6685 37.9249 24.6058 37.9249 19.5814C37.9249 14.5571 33.8781 10.4944 28.899 10.4944ZM17.873 19.5814C17.873 13.464 22.8038 8.49438 28.899 8.49438C34.9941 8.49438 39.9249 13.464 39.9249 19.5814C39.9249 21.3183 39.5274 22.9626 38.8187 24.4269C39.036 24.4036 39.2624 24.451 39.4612 24.5773L49.4871 30.9481C49.9532 31.2443 50.091 31.8623 49.7948 32.3284C49.4986 32.7946 48.8806 32.9323 48.4144 32.6361L38.3885 26.2653C38.2154 26.1553 38.0876 26.001 38.0105 25.8265C36.0261 28.7486 32.6875 30.6685 28.899 30.6685C22.8038 30.6685 17.873 25.6989 17.873 19.5814ZM8.96085 36.0392C8.96085 35.487 9.40856 35.0392 9.96085 35.0392H27.7847C28.337 35.0392 28.7847 35.487 28.7847 36.0392C28.7847 36.5915 28.337 37.0392 27.7847 37.0392H9.96085C9.40856 37.0392 8.96085 36.5915 8.96085 36.0392ZM9.96085 28.6685C9.40856 28.6685 8.96085 29.1162 8.96085 29.6685C8.96085 30.2207 9.40856 30.6685 9.96085 30.6685H15.5308C16.0831 30.6685 16.5308 30.2207 16.5308 29.6685C16.5308 29.1162 16.0831 28.6685 15.5308 28.6685H9.96085ZM8.96085 42.41C8.96085 41.8577 9.40856 41.41 9.96085 41.41H27.7847C28.337 41.41 28.7847 41.8577 28.7847 42.41C28.7847 42.9623 28.337 43.41 27.7847 43.41H9.96085C9.40856 43.41 8.96085 42.9623 8.96085 42.41ZM33.1046 16.3693C33.3831 15.8923 33.2222 15.28 32.7452 15.0015C32.2682 14.7231 31.6559 14.884 31.3774 15.3609L27.51 21.9857L24.8886 20.6812C24.3942 20.4352 23.7939 20.6365 23.5478 21.131C23.3018 21.6254 23.5031 22.2257 23.9976 22.4718L27.4564 24.193C27.9277 24.4275 28.5001 24.2565 28.7655 23.8019L33.1046 16.3693Z"
            fill="#A1A1AA"
          />
        </svg>
        Search to view academic papers, blog posts, and book chapters.
      </div>
    </div>
  );
  return (
    <Layout key="index" page="search">
      <div className="grid grid-cols-3">
        <div className="pt-2 bg-gray-50">
          <label className="block px-2">
            <Form
              query={state.query}
              onChange={(query) => {
                onChangeQuery(query);
              }}
              onArrowDown={() => dispatch({ type: "selectFirstIndex" })}
            />
          </label>
          {state.results.length > 0 && (
            <div className="search-left-section overflow-auto pt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="">
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
                </thead>
                <tbody>
                  {state.results.map((i, index) => (
                    <PaperListView
                      item={i.item}
                      score={i.score}
                      index={i.refIndex}
                      onChangeQuery
                      setSelected={() =>
                        dispatch({ type: "setSelectedId", id: i.item.id })
                      }
                      isSelected={state.selectedIndex === index}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="col-span-2 search-right-section overflow-auto px-8 border-l-2 border-gray-200">
          {state.selectedResult
            ? paperPageView({
                ...state.selectedResult,
                onChangeQuery,
              })
            : emptyDescription}
        </div>
      </div>
    </Layout>
  );
}
