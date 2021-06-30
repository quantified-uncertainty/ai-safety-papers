import { GraphQLClient } from "graphql-request";
import {processAlignmentNewsletterBlurb} from "./processAlignmentNewsletterBlurb.js";

// import { request } from 'graphql-request'

const graphcms = new GraphQLClient(
  "https://api.baseql.com/airtable/graphql/appfhl0f1P24kp5Zm"
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
    case "bookSection":
      return "Book Section";
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
    case "NotSafety":
      return false;
    case "<Other org>":
      return false;
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
              itemType
              author
              publicationYear
              citations
              abstractNote
              url
              safetyType
              orgs
              publicationTitle
              anBlurb
              anHighlightFlag
              jeremyBlurb
              conferenceName
            }
    }`
  );
  let papers = response.papers
  let formattedPapers = papers.map((item) => {
    let formattedPaper
    if(item.anBlurb){
      formattedPaper= ({
        ...item,
        abstractNote: item.abstractNote || "",
        author: (!!item.author && item.author.split(";").map(convertAuthor)) || [],
        itemType: formatItem(item.itemType),
        safetyType: formatItem(item.safetyType),
        anHighlightFlag: item.anHighlightFlag === "1",
        orgs: item.orgs
          .split("; ")
          .map(formatItem)
          .filter((r) => !!r),
        anBlurb: processAlignmentNewsletterBlurb({blurb:item.anBlurb, papers})
        })
    }else{
      formattedPaper= ({
        ...item,
        abstractNote: item.abstractNote || "",
        author: (!!item.author && item.author.split(";").map(convertAuthor)) || [],
        itemType: formatItem(item.itemType),
        safetyType: formatItem(item.safetyType),
        anHighlightFlag: item.anHighlightFlag === "1",
        orgs: item.orgs
          .split("; ")
          .map(formatItem)
          .filter((r) => !!r),
        })  
    }
    return formattedPaper
  })
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
