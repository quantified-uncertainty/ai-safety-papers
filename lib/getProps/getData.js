import { GraphQLClient } from "graphql-request";
// import { request } from 'graphql-request'
import fs from "fs"
import { formatItem } from "./formatItems.js";

// From graphQL database
const graphcms = new GraphQLClient(
  "https://api.baseql.com/airtable/graphql/..."
);
const graphqlQuery = `
        query QueryName {
            itemType {
              ...
            }
    }
`
async function getDatabaseFromUrl() {
  let response = await graphcms.request(graphqlQuery);
  let data = response.papers;
  return data
}

// Create data in filesystem
function createData(){
  let loc = './public/orgs/'
  const dataFileNames = fs.readdirSync(loc).filter(x => !x.includes("template"))
  let completeDataFile = []
  dataFileNames.forEach(fileName => {
    let raw = fs.readFileSync(loc + fileName)
    let content = JSON.parse(raw)
    completeDataFile.push(content)
  })
  completeDataFile = completeDataFile.map((element, i) => ({id: i, ...element}))
  fs.writeFileSync("./public/data.json", JSON.stringify(completeDataFile, null, 4))  
}
// createData()

// From filesystem
const databaseFileName = "./public/data.json"
function getDatabaseFromFileSystem() {
  let raw = fs.readFileSync(databaseFileName)
  let data = JSON.parse(raw)
  return data
}

export async function getData() {
  // let data = await getDatabaseFromUrl()
  let data = getDatabaseFromFileSystem()
  let formattedData = data.map(item => formatItem(item, null))
  return formattedData
}