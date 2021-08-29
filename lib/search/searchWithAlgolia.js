import algoliasearch from "algoliasearch";

// To search
let algoliaSearchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
const searchClient = algoliasearch("HEL1Z7MK9U", algoliaSearchKey);
const searchIndex = searchClient.initIndex("ai-safety-papers-main");

export async function searchWithAlgolia({ queryString, hitsPerPage }) {
  hitsPerPage = hitsPerPage || 5;
  let response = await searchIndex.search(queryString, {
    hitsPerPage,
    getRankingInfo: true
  });
  let results = response.hits;
  return results;
}
