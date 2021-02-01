import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getCauses } from "../lib/airtablegraph.js";
import Layout from "./layout.js";
let linkStyle =
  "text-blue-500 hover:text-blue-700 visited:text-blue-700 hover:underline cursor-pointer";
export async function getStaticProps() {
  const { causeArea } = await getCauses();
  return {
    props: {
      items: causeArea,
    },
  };
}

let causeCandidate = ({
  id,
  name,
  totalKarmaDiscussing,
  articles,
  depthOfCurrentResearch,
  levelOfSpecificity,
  promisingness,
  readiness,
}) => {
  return (
    <div key={id} className="pb-4">
      <Link href={`/posts/${id}`} passHref>
        <span className="text-sm font-medium text-blue-600 hover:text-blue-800 visited:text-blue-800 hover:underline cursor-pointer">
          {name}
        </span>
      </Link>
      <div className="mt-1 text-sm text-gray-400 sm:mt-0 sm:col-span-2">
        karma: {totalKarmaDiscussing}, posts:{" "}
        {(articles && articles.length) || 0}, depth: {depthOfCurrentResearch},
        specificity: {levelOfSpecificity}, promisingness: {promisingness},
        readiness: {readiness}
      </div>
    </div>
  );
};

let cause = ({ id, name, causeCandidates }) => {
  return (
    <div key={id} className="pb-4">
      <div className="text-xl mb-2">{name}</div>
      {causeCandidates.map((c) => causeCandidate(c))}
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
          This is a list of potential Effective Altruist cause candidates. We
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
      {items.map((i) => cause(i))}
    </Layout>
  );
}
