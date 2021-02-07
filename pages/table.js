import Layout from "./layout.js";

export default function Table() {
  return (
    <Layout key="index" page="table">
      <div className="mt-8 mb-4 container mx-auto max-w-3xl">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight mb-2">
          Table View
        </h1>
        <p className="text-gray-800">
          This is the complete Airtable table. You can use this to copy the CSV
          if you like. Note that it can take a few seconds to load.
        </p>
      </div>
      <iframe
        className="airtable-embed airtable-embed-height"
        src="https://airtable.com/embed/shreirSeEO5UxpwEO?backgroundColor=gray"
        frameborder="0"
        onmousewheel=""
        width="100%"
        height="500px"
      ></iframe>
    </Layout>
  );
}
