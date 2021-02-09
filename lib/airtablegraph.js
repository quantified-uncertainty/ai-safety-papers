import { GraphQLClient } from "graphql-request";
// import { request } from 'graphql-request'

const graphcms = new GraphQLClient(
  "https://api.baseql.com/airtable/graphql/appUXHZSHzRN09M55"
);

let convertAuthor = (name) => {
  const name2 = name.split(", ");
  return name2.length === 2 ? `${name2[1]} ${name2[0]}` : name;
};

function formatItem(item) {
  switch (item) {
    case "conferencePaper":
      return "Conference Paper";
    case "blogPost":
      return "Blog Post";
    case "manuscript":
      return "Manuscript";
    case "report":
      return "Report";
    case "book":
      return "Book";
    case "journalArticle":
      return "Journal Article";
    case "magazineArticle":
      return "Magazine Article";
    case "TechSafety":
      return "Tech Safety";
    case "MetaSafety":
      return "Meta Safety";
    case "AmbiguosSafety":
      return "Ambiguous Safety";
    default:
      return item;
  }
}

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
    itemType: formatItem(item.itemType),
    manualTags: item.manualTags
      .split("; ")
      .filter((r) => r !== "NotSafety" && r !== "Other-org")
      .map(formatItem),
  }));
  console.log("Response", formattedPapers);
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
