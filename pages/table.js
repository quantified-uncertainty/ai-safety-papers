import Layout from "./layout.js";

export default function Table() {
  return (
    <Layout key="index">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Database View
        </h1>
      </div>
      <iframe
        className="airtable-embed"
        src="https://airtable.com/embed/shreirSeEO5UxpwEO?backgroundColor=gray"
        frameborder="0"
        onmousewheel=""
        width="100%"
        height="533"
      ></iframe>
    </Layout>
  );
}
