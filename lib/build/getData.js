import fs from "fs"
import readline from "readline"
import getAlignmentNewsletterItems from "./getAlignmentNewsletterItems.js"
import { getTAISBibliographicDatabaseItems } from "./getTAISBibliographicDatabaseItems.js"
import { processAlignmentNewsletterBlurb } from "./processAlignmentNewsletterBlurb.js";

/* Definitions */
let databaseFilepath = "./data/database.json"
let databaseSimilarItemsFilePath = "./data/databaseSimilarItems.json"

/* Utilities */
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

async function merge(taisBibliographicDatabaseItems, alignmentNewsletterItems) {
  let similars = []
  try {
    similars = JSON.parse(fs.readFileSync(databaseSimilarItemsFilePath))

  } catch (error) {
    console.log(error)
  }
  let newSimilars = [...similars]

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
  let displayAuthors = (author) => author.join(", ")

  let aiSafetyDatabaseTitles = taisBibliographicDatabaseItems.map(item => item.title)
  let itemsNotInTAISDatabase = []
  for (let item of alignmentNewsletterItems) {
    let distances = aiSafetyDatabaseTitles.map(title => similarity(item.title.toLowerCase(), title.toLowerCase()))
    let maxSimilarity = Math.max(...distances)
    let indexOfMostSimilar = distances.indexOf(maxSimilarity)
    let mostSimilarItem = taisBibliographicDatabaseItems[indexOfMostSimilar]
    let maxTitle = taisBibliographicDatabaseItems[indexOfMostSimilar].title

    let title1 = item.title.toLowerCase().replace(/\??"?'?“?”?,?:?’?/g, "")
    let title2 = maxTitle.toLowerCase().replace(/\??"?'?“?”?,?:?:?’?/g, "")
    let url1 = item.url ? item.url.replace("http://", "https://") : null
    let url2 = mostSimilarItem.url ? mostSimilarItem.url.replace("http://", "https://") : null

    if (maxTitle == item.title) {
      taisBibliographicDatabaseItems[indexOfMostSimilar] = ({
        ...mostSimilarItem,
        url: url2 || url1,
        anBlurb: item.anBlurb,
        anHighlightFlag: item.anHighlightFlag
      })
    } else if (title1 == title2 || url1 == url2) {
      taisBibliographicDatabaseItems[indexOfMostSimilar] = ({
        ...mostSimilarItem,
        altTitle: item.title,
        url: url2 || url1,
        anBlurb: item.anBlurb,
        anHighlightFlag: item.anHighlightFlag,
      })
    } else if (maxSimilarity > 0.8) {


      let potentialSimilars = similars.filter(row => row[0] == mostSimilarItem.title && row[1] == item.title)
      // console.log(potentialSimilars)
      let areTheyTheSame
      if(potentialSimilars.length > 0){
        areTheyTheSame = potentialSimilars[0][2]
      }else{
        console.log("")
        console.log("Are these two items the same?")
        console.log("Similarity: ", maxSimilarity)
  
        console.log("    " + item.title)
        console.log("         " + item.url)
        console.log("         by " + displayAuthors(item.author))
  
        console.log("    " + maxTitle)
        console.log("         by " + displayAuthors(mostSimilarItem.author))
        console.log("         " + mostSimilarItem.url)
        let answer = await synchronousPrompt()
        areTheyTheSame = answer == "y" || false
      }
      if (areTheyTheSame) {
        taisBibliographicDatabaseItems[indexOfMostSimilar] = ({
          ...mostSimilarItem,
          altTitle: item.title,
          url: url2 || url1,
          anBlurb: item.anBlurb,
          anHighlightFlag: item.anHighlightFlag
        })
        newSimilars.push([mostSimilarItem.title, item.title, true])
      } else {
        itemsNotInTAISDatabase.push(item)
        newSimilars.push([mostSimilarItem.title, item.title, false])
      }

    } else {
      itemsNotInTAISDatabase.push(item)
    }
  }
  rl.close()
  fs.writeFileSync(databaseSimilarItemsFilePath, JSON.stringify(newSimilars, null, 4))

  let totalItems = [...taisBibliographicDatabaseItems, ...itemsNotInTAISDatabase]
  return totalItems
}

let getUnixTime = date => Math.floor(date.getTime() / 1000)
let checkDate = () => {
  let threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  console.log(threeDaysAgo)
  let stats = fs.statSync(databaseFilepath);

  let lastModifiedDate = stats.mtime
  let lastModifiedRecently = lastModifiedDate > threeDaysAgo
  let message = lastModifiedRecently ?
    "File is recent. Proceed" :
    "File is not recent enough;\ndownload the html anew from https://docs.google.com/spreadsheets/d/1PwWbWZ6FPqAgZWOoOcXM8N_tUCuxpEyMbN1NYYC02aM/edit#gid=0"
  console.log(message)

  return (lastModifiedRecently)
}

function processAlignmentNewsletterBlurbsSecondPass() {
  let data = JSON.parse(fs.readFileSync(databaseFilepath))

  let data2 = data.map(item => {
    if (!!item.anBlurb) {
      item.anBlurb = processAlignmentNewsletterBlurb({
        blurb: item.anBlurb,
        papers: data,
      });
    }
    return item
  })
  // fs.writeFileSync(databaseFilepath, JSON.stringify(data2, null, 4))
  return data2
}

/* Main */

export async function getData() {
  console.clear()
  if (checkDate()) {
    console.log("Fetching AN Database")
    let alignmentNewsletterItems = await getAlignmentNewsletterItems()
    console.log("Done.")

    console.log("Fetching TAIS Bibliographic Database")
    let taisBibliographicDatabaseItems = await getTAISBibliographicDatabaseItems();
    console.log("Done.")

    console.log("Starting merge process")
    let mergedItems = await merge(taisBibliographicDatabaseItems, alignmentNewsletterItems)
    console.log("Done")

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
    mergedItemsWithFormattedANBlurbs = processAlignmentNewsletterBlurbsSecondPass()
    console.log("Done")

    console.log("Writting to file")
    fs.writeFileSync(databaseFilepath, JSON.stringify(mergedItemsWithFormattedANBlurbs, null, 4))
    return mergedItemsWithFormattedANBlurbs;
  }
}
// getData()

function manipulateData() {
  let data = JSON.parse(fs.readFileSync(databaseFilepath))

  let data2 = data.map(item => {
    if (!!item.anBlurb) {
      item.anBlurb = processAlignmentNewsletterBlurb({
        blurb: item.anBlurb,
        papers: data,
      });
    }
    return item
  })

  // More meaningfull examples:
  /*

  let id = x => x
  let data2 = data.map(item => {
    item = id(item)
    return item
  })

  let data2 = data.map(item => {
    if (!!item.publicationTitle) {
      item.publicationTitle = item.publicationTitle ? item.publicationTitle.replace(/<.*?>/g, "") : ""
    }
    return item
  })
  */

  fs.writeFileSync(databaseFilepath, JSON.stringify(data2, null, 4))
}
// manipulateData()