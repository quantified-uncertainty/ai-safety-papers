import Link from "next/link";
import Layout from "../layout.js";
import {
  getCauseCandidateIds,
  getCauseCandidate,
} from "../../lib/airtablegraph.js";

let article = ({
  authors,
  title,
  url,
  shortSummaryByNuno,
  wordCount,
  commentCount,
  karma,
}) => (
  <div className="p-2 mt-4 border-2 border-light-blue-500">
    <div className="font-bold text-gray-700 text-lg">{title}</div>
    <div className="mb-4 text-xs">
      <div className="text-gray-500">
        {authors.map(({ name }) => (
          <div>{name}</div>
        ))}
        <span>
          {" "}
          karma: {karma}, comments: {commentCount}, words: {wordCount}{" "}
        </span>
      </div>
    </div>
    <div className="text-gray-700 text-sm mb-3">{shortSummaryByNuno}</div>
    <a
      href={url}
      className="text-xs text-blue-500 hover:text-blue-700 visited:text-blue-700 hover:underline cursor-pointer"
    >
      {url}
    </a>
  </div>
);

function Post({ id, name, totalKarmaDiscussing, causeArea, articles }) {
  return (
    <Layout key={id}>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {name}
          </h2>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              {totalKarmaDiscussing}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              {causeArea[0].name}
            </div>
          </div>
        </div>
      </div>
      {articles.map((i) => article(i))}
    </Layout>
  );
}

export async function getStaticPaths() {
  const { causeCandidates } = await getCauseCandidateIds();
  return {
    paths: causeCandidates.map((p) => `/posts/${p.id}`),
    fallback: false,
  };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  const { causeCandidates } = await getCauseCandidate(params.id);

  return { props: causeCandidates[0] };
}

export default Post;
