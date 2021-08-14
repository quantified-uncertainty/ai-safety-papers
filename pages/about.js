import React from "react";
import { markdownRenderer } from "../lib/display/markdownRenderer.js";
import Layout from "./layout.js";

let aboutMarkdownText = `## About
AI Safety Papers is a website search tool for academic papers and blog posts relevant to AI Safety. It shows the number of citations for papers, and blurbs by select authors for select posts. It's created around a [corresponding database](https://www.lesswrong.com/posts/4DegbDJJiMX2b3EKm/tai-safety-bibliographic-database). We plan to update the database every few months. The Github repository for the website is at https://github.com/QURIresearch/ai-safety-papers.

## Team
The database is maintained by Jess Riedel and Angelica Deibel. You can read more about this on the corresponding blog post [here](https://www.lesswrong.com/posts/4DegbDJJiMX2b3EKm/tai-safety-bibliographic-database).
This website is maintained by Ozzie Gooen and Nuño Sempere via [The Quantified Uncertainty Research Institute](https://quantifieduncertainty.org/).

## Tips
- Most of the fields are clickable. Click on an author to see other papers with the same author, or on a tag to see other papers which also have it. 
- To quickly go through query results, use the up and down arrows after entering a search.
- Besides the search function, there is also an (Airtable) table view, which can be browsed directly or downloaded as a CSV.

## Questions

### How can I give feedback?
Please submit feedback through [this website](https://github.com/QURIresearch/ai-safety-papers/discussions) or contact us directly at hello@quantifieduncertainty.org.

### How is it decided which documents to include for the database?
The database covers a mix of conference papers, manuscripts, reports, books, journal articles, magazine articles, and blog posts. Most of the blog posts come from [The Alignment Forum](https://www.alignmentforum.org/) and [LessWrong](https://www.lesswrong.com/). Posts relevant to Artificial Intelligence Alignment were selected. Please see [the post](https://www.lesswrong.com/posts/4DegbDJJiMX2b3EKm/tai-safety-bibliographic-database) on the database for some information here.

### What does "distance" mean?
We use a simple search tool for string similarity. Distance refers to the difference of the search term and terms in the corresponding results. 

### Why is this valuable, when we already have [Google Scholar]?
There are already several existing tools for search and statistics of Academic articles. These are much more general-purpose than AI Safety Papers. Google Scholar has many features that AI Safety Papers doesn't, but this site has a few advantages:
- A selection of documents with relevance specifically to AI safety
- Easy filtering for papers of particular AI Safety related organizations
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
            __html: markdownRenderer(aboutMarkdownText)
          }}
        />
      </div>
    </Layout>
  );
}
