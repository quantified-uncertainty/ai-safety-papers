import Link from "next/link";
import { getTable } from "../../lib/airtable.js";

function Post({ post }) {
  return (
    <div>
      <Link href="/">Home</Link>
      <h1>{post.name}</h1>
      <p>{post.description}</p>
      <div> {post.rating} </div>
      {post.images.map((image) => (
        <img
          style={{ maxWidth: 200 }}
          key={image}
          src={image}
          alt={post.name}
        />
      ))}
    </div>
  );
}

export async function getStaticPaths() {
  const records = await getTable("Narrow Cause Area")
    .select({
      fields: [],
    })
    .all();

  const products = records.map((product) => {
    return {
      id: product.id,
    };
  });

  return { paths: products.map((p) => `/posts/${p.id}`), fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1

  // Pass post data to the page via props
  const record = await getTable("Narrow Cause Area").find(params.id);

  let post = {
    id: record.id,
    name: record.get("Name"),
    description: record.get("Description") || null,
    rating: record.get("Generic Rating") || null,
    images: (record.get("Image") || []).map((i) => i.url),
  };

  return { props: { post } };
}

export default Post;
