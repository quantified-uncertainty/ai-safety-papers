import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getCauseCandidates } from "../lib/airtablegraph.js";
import Layout from "./layout.js";

export async function getStaticProps() {
  const { causeCandidates } = await getCauseCandidates();
  return {
    props: {
      items: causeCandidates,
    },
  };
}

let causeCandidate = ({ id, name, totalKarmaDiscussing, causeArea }) => {
  return (
    <div key={id} className="pb-4">
      <Link href={`/posts/${id}`} passHref>
        <span className="text-sm font-medium text-blue-600 hover:text-blue-800 visited:text-blue-800 hover:underline cursor-pointer">
          {name}
        </span>
      </Link>
      <span className="mt-1 sm:mt-0 sm:col-span-2 text-gray-700 bg-gray-200 hover:bg-gray-400 hover:text-gray-900 px-1 py-1 rounded-sm text-sm cursor-pointer">
        {causeArea[0].name}
      </span>
      <div className="mt-1 text-sm text-gray-500 sm:mt-0 sm:col-span-2">
        <ReactMarkdown>{totalKarmaDiscussing}</ReactMarkdown>
      </div>
    </div>
  );
};

export default function Home({ items }) {
  return <Layout key="index">{items.map((i) => causeCandidate(i))}</Layout>;
}
