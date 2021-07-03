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

export async function getData() {
  let response = await graphcms.request(graphqlQuery);
  let items = response.papers;

  return {
    ...response,
    items: items.map(item => formatItem(item, items)),
  };
}