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
      className="hover:bg-denim-100 cursor-pointer"
      onClick={() => setSelected(id)}
    >
      <td className="px-2 py-2">
        <div>
          <div className="">{title}</div>
          <div>
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
      <td className="px-2 text-gray-600">{publicationYear}</td>
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
      <span
        className="mr-4 cursor-pointer hover:text-gray-800 hover:underline"
        onClick={() => onChangeQuery(title)}
      >
        {title}
      </span>
    );
  return (
    <div key={id} className="container mx-auto pt-4">
      <div className="text-sm text-gray-500 pb-4">
        {tagCss(publicationTitle)}
        {manualTags.split(";").map((item) => tagCss(item))}
        {tagCss(itemType)}
      </div>
      <h2 className="text-xl text-denim-600 underline pb-1">
        <a href={url}>{title}</a>
      </h2>
      <div className="pb-1">
        {author.split(";").map((item) => (
          <span className={personNameStyle} onClick={() => onChangeQuery(item)}>
            {item}
          </span>
        ))}
        <span className="text-gray-400">({publicationYear})</span>
      </div>
      <div className="text-gray-400 text-xs pb-2">
        <a href={url}>{url}</a>
      </div>
      {abstractNote && (
        <div className="prose readable-text bg-neutral-100 text-neutral-600 mt-4 mb-5 max-w-6xl">
          <ReactMarkdown>
            {(abstractNote && cleanMarkdown(abstractNote)) || ""}
          </ReactMarkdown>
        </div>
      )}

      <div className="inline-flex bg-gray-100 px-2 py-1 rounded-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="flex w-5 mr-2 text-gray-300"
        >
          <path
            fill-rule="evenodd"
            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7"
            clip-rule="evenodd"
          />
        </svg>
        <div className="flex text-sm text-gray-700"> Alignment Newsletter</div>
      </div>
      <div className="prose readable-text p-2 bg-neutral-100 text-neutral-600 mt-1 mb-2 max-w-6xl bg-green-100">
        <ReactMarkdown source={cleanMarkdown(shahBlurb)} />
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
      <div className="grid grid-cols-3 gap-4">
        <div className="px-2 pt-2">
          <label className="block mb-4">
            <Form
              values={values}
              onChange={(result) => {
                setValues(result);
                const results = fuse.search(result.query);
                setResults(results);
              }}
            />
          </label>
          <div className="almost-all-height1 overflow-auto pr-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="">
                <tr>
                  <th
                    scope="col"
                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
