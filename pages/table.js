import Layout from "./layout.js";

export default function Table() {
  return (
    <Layout key="index" page="table">
      <div className="mt-4 mb-4 p-10">
        <h1 className="text-xl font-bold text-gray-600">Table View</h1>
        <p className="text-gray-600">
          This is the complete Airtable table. You can use this to copy the CSV
          if you like. Note that it can take a few seconds to load. Also note that in Database Browser Bare this section displays nothing / an error
        </p>
      </div>
      <iframe
        className="airtable-embed airtable-embed-height"
        src="https://airtable.com/embed/shr<slug>?backgroundColor=gray"
        frameBorder="0"
        onmousewheel=""
        width="100%"
        height="500px"
      ></iframe>
    </Layout>
  );
}
