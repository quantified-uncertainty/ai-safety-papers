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
        <div className="prose readable-text text-gray-700 bg-neutral-100 text-neutral-600 mt-4 mb-5 max-w-5xl">
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
        <div className="prose readable-text p-4 bg-neutral-100 text-neutral-600 mt-1 mb-2 max-w-5xl text-gray-700">
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
  return (
    <Layout key="index">
      <div className="grid grid-cols-3">
        <div className="pt-2 bg-gray-50">
          <label className="block mb-4 px-2">
            <Form
              values={values}
              onChange={(result) => {
                setValues(result);
                const results = fuse.search(result.query);
                setResults(results);
              }}
            />
          </label>
          <div className="almost-all-height1 overflow-auto">
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
        </div>
        <div className="col-span-2 almost-all-height overflow-auto px-4 border-l-2 border-gray-200">
          {foundElement &&
            paperPageView({
              ...foundElement,
              onChangeQuery,
            })}
        </div>
      </div>
    </Layout>
  );
}
