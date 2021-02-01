import Link from "next/link";
import { getPapers } from "../lib/airtablegraph.js";
import Layout from "./layout.js";
import ReactMarkdown from "react-markdown";
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
  itemType,
  url,
}) => {
  return (
    <div key={id} className="pb-4">
      <div className="text-xl mb-2">{title}</div>
      <div>{author}</div>
      <ReactMarkdown>{shahBlurb}</ReactMarkdown>
      <div>{publicationYear}</div>
      <div>{itemType}</div>
      <div>{url}</div>
    </div>
  );
};

export default function Home({ items }) {
  return (
    <Layout key="index">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Big List of Papers
        </h1>
      </div>
      <hr className="border-gray-200 mb-4"></hr>
      {items.map((i) => paper(i))}
    </Layout>
  );
}
