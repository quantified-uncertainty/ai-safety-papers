import { GraphQLClient } from "graphql-request";
import { formatItem } from "./formatItems.js";

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

export async function getTAISBibliographicDatabaseItems() {
  let response = await graphcms.request(graphqlQuery);
  let data = response.papers;
  let formattedData = data.map((item) => formatItem(item, data))
  return formattedData;
}
