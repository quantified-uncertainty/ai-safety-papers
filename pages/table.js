import Layout from "./layout.js";

export default function Table() {
  return (
    <Layout key="index" page="table">
      <div className="mt-4 mb-4 p-10">
        <h1 className="text-xl font-bold text-gray-600">Table View</h1>
        <p className="text-gray-600">
          This is the complete Airtable table. You can use this to copy the CSV
          if you like. Note that it can take a few seconds to load. Note also that
          unlike the search, the contents are up to date with the
          <a href="https://www.lesswrong.com/posts/4DegbDJJiMX2b3EKm/tai-safety-bibliographic-database"> TAI Safety Bibliographic Database</a>,
          but not with the <a href="http://rohinshah.com/alignment-newsletter/">Alignment Newsletter</a>
        </p>
      </div>
      <iframe
        className="airtable-embed airtable-embed-height"
        src="https://airtable.com/embed/shreirSeEO5UxpwEO?backgroundColor=gray"
        frameBorder="0"
        onmousewheel=""
        width="100%"
        height="500px"
      ></iframe>
    </Layout>
  );
}
