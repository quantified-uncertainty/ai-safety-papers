import React from "react";
import { markdownRenderer } from "../lib/markdownRenderer.js";
import Layout from "./layout.js";

let aboutMarkdownText = `## What is this webpage about?
This is a search tool for AI safety papers which we hope will be useful to researchers working on the topic. You can see the underlying code [here](https://github.com/QURIresearch/ai-safety-papers); its underlying database is updated around once a month.

## Tips
- Most of the fields are clickable. Click on an author to see other papers with the same author, or on a tag to see other papers which also have it. 
- To quickly go through query results, use the up and down arrows after entering a search.
- Besides the search function, there is also a table view, which can be browsed directly or downloaded as a csv.

## Who is behind this?
[person] and [person] did most of the database work. [Maybe say something about where the data comes from, presumably from Rohin's database plus other places?]. Ozzie Gooen was the programming lead, both for the backend (a simple Graphql database built on top of an Airtable), and the webpage itself, built using Next.js and Tailwind CSS. Nuño Sempere contributed some finishing touches.

`;

export default function About() {
  return (
    <Layout key="index" page="about">
      <div className="prose p-10 bg-neutral-100 text-neutral-600 mt-1 mb-2 max-w-5xl text-gray-700">
      <div dangerouslySetInnerHTML={{ __html: markdownRenderer(aboutMarkdownText) }} />
      </div>
    </Layout>
  );
}