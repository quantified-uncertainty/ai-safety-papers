import fs from "fs"
import readline from "readline"
import { GraphQLClient } from "graphql-request";
// import { request } from 'graphql-request'
import { formatItem } from "./formatItems.js";
import  getAIAlignmentNewsletterItems from "./getAIAlignmentNewsletterItems.js"
import { processAlignmentNewsletterBlurb } from "./processAlignmentNewsletterBlurb.js";

const graphcms = new GraphQLClient(
  "https://api.baseql.com/airtable/graphql/appLU5cj7USRyqyvn"
);
const graphqlQuery = `
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
    }
`;

async function getTAISafetyBibliographicDatabaseFromUrl() {
  let response = await graphcms.request(graphqlQuery);
  let data = response.papers;
  return data;
}

/* Helpers */
function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

let displayAuthors = (author) => author.join(", ")

async function merge (taiSafetyBibliographicDatabaseItems, aiAlignmentNewsletterItems){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  function readLineAsync(message) {
    return new Promise((resolve, reject) => {
      rl.question(message, (answer) => {
        resolve(answer);
      });
    });
  } 
  async function synchronousPrompt() {
    var promptInput = await readLineAsync("[y/n]: ");
    return promptInput
  }

  let aiSafetyDatabaseTitles = taiSafetyBibliographicDatabaseItems.map(item => item.title)
  // let itemsInTAISDatabase = []
  let itemsNotInTAISDatabase = []
  for(let item of aiAlignmentNewsletterItems){
    let distances = aiSafetyDatabaseTitles.map(title => similarity(item.title.toLowerCase(), title.toLowerCase()))
    let maxSimilarity = Math.max(...distances)
    let indexOfMostSimilar = distances.indexOf(maxSimilarity)
    let mostSimilarItem = taiSafetyBibliographicDatabaseItems[indexOfMostSimilar]
    let maxTitle = taiSafetyBibliographicDatabaseItems[indexOfMostSimilar].title

    let title1 = item.title.toLowerCase().replace(/\??"?'?“?”?,?:?’?/g, "")
    let title2 = maxTitle.toLowerCase().replace(/\??"?'?“?”?,?:?:?’?/g, "")
    let url1 = item.url ? item.url.replace("http://", "https://") : null
    let url2 = mostSimilarItem.url ? mostSimilarItem.url.replace("http://", "https://") : null

    if(maxTitle == item.title || url1 == url2){
      // itemsInTAISDatabase.push(item)
    }else if(title1 == title2){
      // console.log("Identical items", 1)
      taiSafetyBibliographicDatabaseItems[indexOfMostSimilar] = ({
        ...mostSimilarItem, 
        altTitle: item.title,
        url: mostSimilarItem.url || item.url,
        anBlurb: item.anBlurb,
        anHighlightFlag: item.anHighlightFlag
      })
    }else if(maxSimilarity > 0.8){
      console.log("")
      console.log("Are these two items the same?")
      console.log("Similarity: ", maxSimilarity)
      console.log("    " + item.title)
      console.log("         "  + item.url)
      console.log("         by "  + displayAuthors(item.author))
      // console.log(item)
      console.log("    " + maxTitle)
      console.log("         by "  + displayAuthors(mostSimilarItem.author))
      console.log("         "  + mostSimilarItem.url)
      // console.log(mostSimilarItem)

      let answer = await synchronousPrompt()
      if(answer == "y"){
        // itemsInTAISDatabase.push(item)
        taiSafetyBibliographicDatabaseItems[indexOfMostSimilar] = ({
          ...mostSimilarItem, 
          altTitle: item.title,
          url: mostSimilarItem.url || item.url,
          anBlurb: item.anBlurb,
          anHighlightFlag: item.anHighlightFlag
          // Some fun things one could do here
        })
      }else{
        itemsNotInTAISDatabase.push(item)
      }
      
    }else{
      // console.log("maxSimilarity: ", maxSimilarity)
      itemsNotInTAISDatabase.push(item)
    }
  }
  itemsNotInTAISDatabase.sort()
  // console.log(itemsNotInTAISDatabase)
  // console.log(itemsNotInTAISDatabase.length)
  rl.close();
  let totalItems = [...taiSafetyBibliographicDatabaseItems, ...itemsNotInTAISDatabase]
  return totalItems
}

/* Main */

export async function getData() {
  console.clear()
  console.log("Fetching AN Database")
  let aiAlignmentNewsletterItems = await getAIAlignmentNewsletterItems()
  console.log("Done.")
  
  console.log("Fetching Bibliographic Database")
  let taiSafetyBibliographicDatabaseItems = await getTAISafetyBibliographicDatabaseFromUrl();
  let formattedTAISafetyBibliographicDatabaseItems = taiSafetyBibliographicDatabaseItems.map((item) => formatItem(item, taiSafetyBibliographicDatabaseItems));
  console.log("Done.")

  console.log("Starting merge process.")
  let mergedItems = await merge(formattedTAISafetyBibliographicDatabaseItems, aiAlignmentNewsletterItems)

  console.log("Formatting AN blurbs")
  let mergedItemsWithFormattedANBlurbs = mergedItems.map(item => {
    if (!!item.anBlurb) {
      item.anBlurb = processAlignmentNewsletterBlurb({
        blurb: item.anBlurb,
        papers: mergedItems,
      });
    }
    return item
  })
  console.log("Done")

  console.log("Writting to file")
  fs.writeFileSync("./data/fullDatabase.json", JSON.stringify(mergedItemsWithFormattedANBlurbs, null, 4))
  return mergedItemsWithFormattedANBlurbs;
}
// getData()