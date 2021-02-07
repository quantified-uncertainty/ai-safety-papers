import { GraphQLClient } from "graphql-request";
// import { request } from 'graphql-request'

const graphcms = new GraphQLClient(
  "https://api.baseql.com/airtable/graphql/appUXHZSHzRN09M55"
);

let convertAuthor = (name) => {
  const name2 = name.split(",");
  return name2.length === 2 ? `${name2[1]} ${name2[0]}` : name;
};

export async function getPapers() {
  let response = await graphcms.request(
    `
        query PaperIndex {
            papers {
              id
              title
              author
              shahBlurb
              publicationYear
              itemType
              url
              manualTags
              publicationTitle
              abstractNote
            }
    }`
  );
  let formattedPapers = response.papers.map((item) => ({
    ...item,
    author: item.author.split(";").map(convertAuthor),
    manualTags: item.manualTags
      .split(";")
      .filter((r) => r !== "NotSafety" && r !== "Other-org"),
  }));
  return {
    ...response,
    papers: formattedPapers,
  };
}

export async function getPaperIds() {
  return await graphcms.request(
    `
        query PaperIndex {
            papers {
              id
            }
    }`
  );
}
