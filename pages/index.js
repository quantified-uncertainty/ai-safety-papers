import Head from "next/head";
import Link from "next/link";
import Airtable from "airtable";
import ReactMarkdown from "react-markdown";
import { getTable, getRecord } from "../lib/airtable.js";

export async function getStaticProps() {
  const records = await getTable("Narrow Cause Area")
    .select({
      fields: ["Name", "Description", "Image", "General Rating"],
    })
    .all();

  const products = records.map((p) => {
    let get = getRecord["Narrow Cause Area"];
    return {
      id: get["id"](p),
      name: get["name"](p),
      description: get["description"](p),
      image: get["image"](p),
    };
  });

  return {
    props: {
      products,
    },
  };
}

let person = ({ src, name, description, rating, id }) => (
  <div key={id}>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          {src ? (
            <img className="h-10 w-10 rounded" src={src} alt="" />
          ) : (
            <div />
          )}
        </div>
        <div className="ml-4">
          <Link href={`/posts/${id}`} passHref>
            <span className="text-sm font-medium text-blue-600 hover:text-blue-800 visited:text-blue-800 hover:underline cursor-pointer">
              {name}
            </span>
          </Link>
        </div>
      </div>
    </td>
    <td className="mt-1 text-sm text-gray-500 sm:mt-0 sm:col-span-2">
      <ReactMarkdown>{description}</ReactMarkdown>
    </td>
  </div>
);

export default function Home({ products }) {
  return (
    <div>
      <Head>
        <title>Create Next App!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container px-6 mx-auto grid">
          <div className="w-full overflow-hidden rounded-lg shadow">
            <div className="w-full overflow-x-auto">
              <div className="bg-white divide-y divide-gray-200">
                {products.map((product) =>
                  person({
                    id: product.id,
                    src: product.name,
                    name: product.name,
                    description: product.description,
                    src: product.image,
                    rating: product.rating,
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
