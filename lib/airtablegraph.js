import { GraphQLClient } from "graphql-request";
// import { request } from 'graphql-request'

const graphcms = new GraphQLClient(
  "https://api.baseql.com/airtable/graphql/appUXHZSHzRN09M55"
);

export async function getPapers() {
  return await graphcms.request(
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
