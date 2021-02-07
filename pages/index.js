import { getPapers } from "../lib/airtablegraph.js";
import Layout from "./layout.js";
import ReactMarkdown from "react-markdown";
import Fuse from "fuse.js";
import React, { useState } from "react";
import Form from "../lib/form.js";

let linkStyle =
  "text-denim-600 hover:text-denim-800 visited:text-denim-800 hover:underline cursor-pointer";
let personNameStyle =
  "text-green-600 cursor-pointer hover:underline hover:text-green-700 mr-1";
export async function getStaticProps() {
  const { papers } = await getPapers();
  return {
    props: {
      items: papers,
    },
  };
}

let paperListView = ({
  id,
  title,
  author,
  shahBlurb,
  publicationYear,
  manualTags,
  publicationTitle,
  abstractNote,
  itemType,
  score,
  onChangeQuery,
  setSelected,
  index,
  url,
}) => {
  return (
    <tr
      key={id}
      className="hover:bg-denim-100 cursor-pointer border-b border-gray-300"
      onClick={() => setSelected(id)}
    >
      <td className="px-4 py-4">
        <div>
          <div className="text-lg text-gray-800">{title}</div>
          <div className="text-sm">
            {author
              .split(";")
              .slice(0, 2)
              .map((item) => (
                <span
                  className={personNameStyle}
                  onClick={() => onChangeQuery(item)}
                >
                  {item}
                </span>
              ))}
          </div>
        </div>
      </td>
      <td className="px-2 text-gray-400">{publicationYear}</td>
      <td className="px-2 text-gray-400">{score.toFixed(2)}</td>
    </tr>
  );
};

let cleanMarkdown = (r) => r.replaceAll("\\", "");
let paperPageView = ({
  id,
  title,
  author,
  shahBlurb,
  publicationYear,
  manualTags,
  publicationTitle,
  abstractNote,
  itemType,
  onChangeQuery,
  url,
}) => {
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
        <a href={url}>{title}</a>
      </h2>
      <div className="pb-4">
        {author.split(";").map((item) => (
          <span className={personNameStyle} onClick={() => onChangeQuery(item)}>
            {item}
          </span>
        ))}
        <span className="text-gray-400">({publicationYear})</span>
      </div>
      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-3 pb-8">
        {tagCss(publicationTitle)}
        {manualTags.split(";").map((item) => tagCss(item))}
        {tagCss(itemType)}
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
          <ReactMarkdown source={cleanMarkdown(shahBlurb)} />
        </div>
      </div>
    </div>
  );
};

const opts = {
  includeScore: true,
  keys: ["title", "author", "abstractNote", "publicationTitle", "manualTags"],
};

const initialValues = {
  query: "",
  typeBlogPost: true,
  typeManuscript: true,
  typeConferencePaper: true,
  typeJournalArticle: true,
  typeReport: true,
};

// TODO: use this for search:
// https://github.com/krisk/Fuse/search?q=%24and

export default function Home({ items }) {
  const [values, setValues] = useState(initialValues);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const foundElement =
    selected &&
    items.find((e) => {
      return e.id == selected;
    });

  let fuse = new Fuse(items, opts);
  let onChangeQuery = (query) => {
    setValues({ ...values, query });
    const results = fuse.search(query);
    setResults(results);
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
              values={values}
              onChange={(result) => {
                setValues(result);
                const results = fuse.search(result.query);
                setResults(results);
              }}
            />
          </label>
          {results.length > 0 && (
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
                      Distance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((i) =>
                    paperListView({
                      ...i.item,
                      onChangeQuery,
                      score: i.score,
                      index: i.refIndex,
                      setSelected,
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="col-span-2 search-right-section overflow-auto px-4 border-l-2 border-gray-200">
          {foundElement
            ? paperPageView({
                ...foundElement,
                onChangeQuery,
              })
            : emptyDescription}
        </div>
      </div>
    </Layout>
  );
}
