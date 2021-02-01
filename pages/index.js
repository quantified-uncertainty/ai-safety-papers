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

let paper = ({
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
  index,
  url,
}) => {
  return (
    <div key={id} className="pb-6 pt-3">
      <div>
        <span>{author},</span>
        <span className="ml-2 mr-2">
          <a href={url} className="font-bold">
            {title}
          </a>
          ,
        </span>
        <span className="text-gray-400">({publicationYear})</span>
      </div>
      <div className="text-sm text-gray-400">
        {publicationTitle} {manualTags}{" "}
      </div>
      <blockquote className="relative p-2 border-l-4 bg-neutral-100 text-neutral-600 border-neutral-500 quote mt-4 mb-2">
        <div className="prose sm:prose-sm max-w-none">
          <ReactMarkdown>{shahBlurb.slice(0, 1000)}</ReactMarkdown>
        </div>
        <div className="text-sm text-blue-400"> - Rohin Shah</div>
      </blockquote>
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

  let fuse = new Fuse(items, opts);
  return (
    <Layout key="index">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Big List of Papers
        </h1>
      </div>
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
      {results
        .slice(0, 10)
        .map((i) => paper({ ...i.item, score: i.score, index: i.refIndex }))}
    </Layout>
  );
}
