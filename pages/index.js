import React, { useState, useEffect, useReducer, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { debounce } from "lodash";

import { getData } from "../lib/getProps/getData.js";
import { searchWithAlgolia } from "../lib/getProps/algolia.js";

import Layout from "./layout.js";
import Fuse from "fuse.js";
import Form from "../lib/display/form.js";
import SearchResultsTableHead from "../lib/display/searchResultsTableHead.js";
import ItemsListView from "../lib/display/itemsListView.js";
import ItemPageView from "../lib/display/itemPageView.js";

// Get Props
export async function getStaticProps() {
  const items = await getData();
  return {
    props: {
      items
    }
  };
}

// Search
const searchMessage =
  "Search to view academic papers, blog posts, and book chapters.";
const opts = {
  includeScore: true,
  keys: [
    "title",
    "author",
    "itemType",
    "url",
    "abstractNote",
    "publicationTitle",
    "orgs",
    "anBlurb"
  ]
};

const initialState = (items) => ({
  query: "",
  isLoading: false,
  results: [],
  selectedId: false,
  selectedIndex: false,
  selectedResult: false
  // fuse: new Fuse(items, opts),
});

// Up and down arrow logic
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

// Reducer logic
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
        selectedResult: state.results[selectedIndex].item
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
        }).item
      };
    case "selectFirstIndex": {
      if (state.results.length > 0) {
        return {
          ...state,
          selectedIndex: 0,
          selectedResult: state.results[0].item
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
          state.results[selectedIndex] && state.results[selectedIndex].item
      };
    }
    case "query":
      return { ...state, query: action.query, selectedIndex: false };
    /*
      case "updateSearch":
      const results = state.fuse
        .search(state.query)
        .filter((r) => r.score < 0.6);
      return { ...state, results };
    */
    case "isLoading":
      return { ...state, isLoading: true };
    case "updateSearchResults":
      return { ...state, results: action.results, isLoading: false };
    default:
      console.log(action);
      throw new Error();
  }
}

// Main React component
export default function Home({ items }) {
  const [state, dispatch] = useReducer(reducer, initialState(items));
  const [searchTimeout, setSearchTimeout] = useState(null);

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

  let updateSearch = async (query) => {
    dispatch({
      type: "isLoading"
    });
    let results = await searchWithAlgolia({
      queryString: query,
      hitsPerPage: 100
    });
    let resultsCompatibleWithFuse = results.map((result) => ({
      item: result,
      score: 0
    }));
    dispatch({
      type: "updateSearchResults",
      results: resultsCompatibleWithFuse
    });
    setSearchTimeout(null);
  };

  let onChangeQueryAndSearch = (isImmediate, query) => {
    dispatch({ type: "query", query });

    clearTimeout(searchTimeout);
    if (isImmediate) {
      setTimeout(() => {
        updateSearch(query);
      }, 1);
    } else {
      let newTimeout = setTimeout(() => {
        updateSearch(query);
      }, 180);
      setSearchTimeout(newTimeout);
    }
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
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.0491638 1C0.0491638 0.447715 0.496879 0 1.04916 0H36.6968C37.2491 0 37.6968 0.447715 37.6968 1V7.21099C37.6968 7.76327 37.2491 8.21099 36.6968 8.21099C36.1446 8.21099 35.6968 7.76327 35.6968 7.21099V2H2.04916V47.7808H35.6968V32.0464C35.6968 31.4942 36.1446 31.0464 36.6968 31.0464C37.2491 31.0464 37.6968 31.4942 37.6968 32.0464V48.7808C37.6968 49.3331 37.2491 49.7808 36.6968 49.7808H1.04916C0.496879 49.7808 0.0491638 49.3331 0.0491638 48.7808V1ZM28.899 10.4944C23.9198 10.4944 19.873 14.5571 19.873 19.5814C19.873 24.6058 23.9198 28.6685 28.899 28.6685C33.8781 28.6685 37.9249 24.6058 37.9249 19.5814C37.9249 14.5571 33.8781 10.4944 28.899 10.4944ZM17.873 19.5814C17.873 13.464 22.8038 8.49438 28.899 8.49438C34.9941 8.49438 39.9249 13.464 39.9249 19.5814C39.9249 21.3183 39.5274 22.9626 38.8187 24.4269C39.036 24.4036 39.2624 24.451 39.4612 24.5773L49.4871 30.9481C49.9532 31.2443 50.091 31.8623 49.7948 32.3284C49.4986 32.7946 48.8806 32.9323 48.4144 32.6361L38.3885 26.2653C38.2154 26.1553 38.0876 26.001 38.0105 25.8265C36.0261 28.7486 32.6875 30.6685 28.899 30.6685C22.8038 30.6685 17.873 25.6989 17.873 19.5814ZM8.96085 36.0392C8.96085 35.487 9.40856 35.0392 9.96085 35.0392H27.7847C28.337 35.0392 28.7847 35.487 28.7847 36.0392C28.7847 36.5915 28.337 37.0392 27.7847 37.0392H9.96085C9.40856 37.0392 8.96085 36.5915 8.96085 36.0392ZM9.96085 28.6685C9.40856 28.6685 8.96085 29.1162 8.96085 29.6685C8.96085 30.2207 9.40856 30.6685 9.96085 30.6685H15.5308C16.0831 30.6685 16.5308 30.2207 16.5308 29.6685C16.5308 29.1162 16.0831 28.6685 15.5308 28.6685H9.96085ZM8.96085 42.41C8.96085 41.8577 9.40856 41.41 9.96085 41.41H27.7847C28.337 41.41 28.7847 41.8577 28.7847 42.41C28.7847 42.9623 28.337 43.41 27.7847 43.41H9.96085C9.40856 43.41 8.96085 42.9623 8.96085 42.41ZM33.1046 16.3693C33.3831 15.8923 33.2222 15.28 32.7452 15.0015C32.2682 14.7231 31.6559 14.884 31.3774 15.3609L27.51 21.9857L24.8886 20.6812C24.3942 20.4352 23.7939 20.6365 23.5478 21.131C23.3018 21.6254 23.5031 22.2257 23.9976 22.4718L27.4564 24.193C27.9277 24.4275 28.5001 24.2565 28.7655 23.8019L33.1046 16.3693Z"
            fill="#A1A1AA"
          />
        </svg>
        {searchMessage}
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
                onChangeQueryAndSearch(false, query);
              }}
              onArrowDown={() => dispatch({ type: "selectFirstIndex" })}
            />
          </label>
          {state.results.length > 0 && (
            <div
              className={`search-left-section overflow-auto pt-2 ${
                state.isLoading ? "opacity-10" : ""
              }`}
            >
              <div className="text-sm text-gray-500 px-2 pt-1">
                {`${state.results.length} results`}
              </div>
              <table className={"min-w-full divide-y divide-gray-200"}>
                <SearchResultsTableHead />
                <tbody>
                  {state.results.slice(0, 100).map((i, index) => (
                    <ItemsListView
                      id={i.item.id}
                      item={i.item}
                      score={i.score}
                      index={i.refIndex}
                      onChangeQuery={(r) => onChangeQueryAndSearch(true, r)}
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
        <div
          className={
            "col-span-2 search-right-section overflow-auto px-8 border-l-2 border-gray-200"
          }
        >
          {state.selectedResult
            ? ItemPageView({
                ...state.selectedResult,
                onChangeQuery: (r) => onChangeQueryAndSearch(true, r)
              })
            : emptyDescription}
        </div>
      </div>
    </Layout>
  );
}
