import React from "react";
import { markdownRenderer } from "../lib/markdownRenderer.js";
import Layout from "./layout.js";

let aboutMarkdownText = `## About
[...] is a website search tool for [...] and [...] relevant to [...]. It shows [...]. It's created around a [corresponding database](...). We plan to update the database every [...]. The Github repository for the website is at [...](...).

Database Browser Bare is a template web search tool, created with the purpose. It was created by simplifying [QURIresearch/ai-safety-papers](https://github.com/QURIresearch/ai-safety-papers). Its github repository can be found [here]().

## Team
The database is maintained by [...] and [...]. You can read more about this on the corresponding blog post [here](...).
This project is maintained by [...] and [...] via [The Quantified Uncertainty Research Institute](https://quantifieduncertainty.org/). 

## Tips
- To quickly go through query results, use the up and down arrows after entering a search.

## Questions

### How can I give feedback?
Please submit feedback through [...](...) or contact us directly at hello@quantifieduncertainty.org.

### How is it decided which documents to include for the database?
[...]

### What does "distance" mean?
We use a simple search tool for string similarity. Distance refers to the difference of the search term and terms in the corresponding results. 

### Why is this valuable, when we already have [Google Scholar]?
There are already several existing tools for search and statistics of Academic articles. These are much more general-purpose than AI Safety Papers. Google Scholar has many features that AI Safety Papers doesn't, but this site has a few advantages:
- Integration with select reviewer blurbs
- Blog posts as well as academic works
- Easy batch downloading (you can download the full CSV for analysis or other use)
`;


export default function About() {
  return (
    <Layout key="index" page="about">
      <div className="prose p-10 bg-neutral-100 text-neutral-600 mt-1 mb-2 max-w-5xl text-gray-700">
        <div
          dangerouslySetInnerHTML={{
            __html: markdownRenderer(aboutMarkdownText),
          }}
        />
      </div>
    </Layout>
  );
}
