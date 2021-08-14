import { processAlignmentNewsletterBlurb } from "./processAlignmentNewsletterBlurb.js";

let convertAuthor = (name) => {
    const name2 = name.split(", ");
    return name2.length === 2 ? `${name2[1]} ${name2[0]}` : name;
};
  
function getItemType(item) {
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

export function formatItem(item, items) {
    let formattedPaper = {
      ...item,
      abstractNote: item.abstractNote || "",
      author:
        (!!item.author && item.author.split(";").map(convertAuthor)) || [],
      itemType: getItemType(item.itemType),
      safetyType: getItemType(item.safetyType),
      anHighlightFlag: item.anHighlightFlag === "1",
      orgs: item.orgs
        .split("; ")
        .map(getItemType)
        .filter((r) => !!r),
    };
    if (!!item.anBlurb) {
      formattedPaper.anBlurb = processAlignmentNewsletterBlurb({
        blurb: item.anBlurb,
        papers: items,
      });
    }
    return formattedPaper;
  };