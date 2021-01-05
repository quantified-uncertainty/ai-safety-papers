import { GraphQLClient } from "graphql-request";
// import { request } from 'graphql-request'

const graphcms = new GraphQLClient(
  "https://api.baseql.com/airtable/graphql/apphIsW8lYRLtbCtW"
);

const fetcher = (query) =>
  request("https://api.baseql.com/airtable/graphql/apphIsW8lYRLtbCtW", query);

export async function getCauseCandidates() {
  return await graphcms.request(
    `
        query CauseCandidatesIndex {
            causeCandidates {
              id
              name
              totalKarmaDiscussing
              causeArea {
                  id
                  name
              }
            }
    }`
  );
}

export async function getCauseCandidateIds() {
  return await graphcms.request(
    `
        query CauseCandidatesIndex {
            causeCandidates {
              id
            }
    }`
  );
}

export async function getCauseCandidate(id) {
  return await graphcms.request(
    `
        query CauseCandidate {
            causeCandidates(id: "${id}") {
              id
              name
              totalKarmaDiscussing
              causeArea {
                  id
                  name
              }
              articles {
                authors {
                  name
                }
                title
                url
                shortSummaryByNuno
                wordCount
                karma
                commentCount
                pages
              }
            }
    }`
  );
}
