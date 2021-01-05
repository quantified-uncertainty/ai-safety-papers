import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getCauseCandidates } from "../lib/airtablegraph.js";
import Layout from "./layout.js";
let linkStyle =
  "text-blue-500 hover:text-blue-700 visited:text-blue-700 hover:underline cursor-pointer";
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
  return (
    <Layout key="index">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Big List of EA Cause Candidates
        </h1>
        <p className="tx-sm text-gray-600">
          This is a list of potential Effective ALtruist cause candidates. We
          have a corresponding blog post{" "}
          <a
            href="https://forum.effectivealtruism.org/posts/SCqRu6shoa8ySvRAa/big-list-of-cause-candidates"
            className={linkStyle}
          >
            here.
          </a>{" "}
          The data is organized on a corresponding Airtable document, which has
          more functionality,{" "}
          <a
            href="https://airtable.com/shrMSZ2chO7CEOqec"
            className={linkStyle}
          >
            here
          </a>
          .
        </p>
      </div>
      <hr className="border-gray-200 mb-4"></hr>
      {items.map((i) => causeCandidate(i))}
    </Layout>
  );
}
