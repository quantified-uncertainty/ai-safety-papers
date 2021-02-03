import { getPapers } from "../lib/airtablegraph.js";
import Layout from "./layout.js";
import ReactMarkdown from "react-markdown";
import Fuse from "fuse.js";
import React, { useState } from "react";
import Form from "../lib/form.js";

let linkStyle =
  "text-blue-500 hover:text-blue-700 visited:text-blue-700 hover:underline cursor-pointer";
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
    <tr key={id} className="hover:bg-blue-200" onClick={() => setSelected(id)}>
      <td className="px-2 py-2">
        <div>
          <div className="">{title}</div>
          <div className="text-green-500">
            {author
              .split(";")
              .slice(0, 2)
              .map((item) => (
                <span
                  className="mr-1 cursor-pointer"
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
  return (
    <div key={id} className="container mx-auto pt-8">
      <h2 className="text-xl text-blue-800 underline pb-4">
        <a href={url}>{title}</a>
      </h2>
      <div className="pb-2 text-green-500">
        {author.split(";").map((item) => (
          <span
            className="mr-1 cursor-pointer"
            onClick={() => onChangeQuery(item)}
          >
            {item}
          </span>
        ))}
        <span className="text-gray-400">({publicationYear})</span>
      </div>
      <div className="text-sm text-gray-400 pb-10">
        <span
          className="mr-2 cursor-pointer"
          onClick={() => onChangeQuery(publicationTitle)}
        >
          {publicationTitle}
        </span>
        {manualTags.split(";").map((item) => (
          <span
            className="mr-2 cursor-pointer"
            onClick={() => onChangeQuery(item)}
          >
            {item}
          </span>
        ))}{" "}
        <span
          className="mr-2 cursor-pointer"
          onClick={() => onChangeQuery(itemType)}
        >
          {itemType}
        </span>
      </div>
      <div className="prose p-2 bg-neutral-100 text-neutral-600 mt-4 mb-2 max-w-6xl bg-gray-50">
        <ReactMarkdown>
          {(abstractNote && cleanMarkdown(abstractNote)) || ""}
        </ReactMarkdown>
      </div>
      <div className="prose p-2 bg-neutral-100 text-neutral-600 mt-4 mb-2 max-w-6xl bg-green-50">
        <ReactMarkdown source={cleanMarkdown(shahBlurb)} />
        <div className="text-sm text-gray-400"> Alignment Newsletter</div>
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
        <div className="">
          <label className="block mb-4 pr-4">
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
            <table>
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
        <div className="col-span-2 almost-all-height overflow-auto pr-4 border-l-2 border-gray-200">
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
