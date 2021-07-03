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