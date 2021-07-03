import { GraphQLClient } from "graphql-request";
// import { request } from 'graphql-request'
import { formatItem } from "./formatItems.js";

const graphcms = new GraphQLClient(
  "https://api.baseql.com/airtable/graphql/appfhl0f1P24kp5Zm"
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
`

async function getDatabaseFromUrl() {
  let response = await graphcms.request(graphqlQuery);
  let data = response.papers;
  return data
}

export async function getData() {
  let data = await getDatabaseFromUrl()
  let formattedData = data.map(item => formatItem(item, items))
  return formattedData
}