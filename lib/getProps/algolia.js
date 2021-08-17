import algoliasearch from 'algoliasearch';
import { getData } from './getData.js'

let algoliaMasterKey = process.env.ALGOLIA_MASTER_API_KEY
const databaseClient = algoliasearch('HEL1Z7MK9U', algoliaMasterKey);
const databaseIndex = databaseClient.initIndex('ai-safety-papers-main');

export async function rebuildAlgoliaDatabase(){
  let records = await getData()
  records = records.map((record, index) => ({...record, objectID: index}) )
  
  if(databaseIndex.exists()){
    console.log("Index exists")
    databaseIndex.replaceAllObjects(records, { safe:true }).catch(error => console.log(error))
    console.log(`Pushed ${records.length} records. Algolia will update asynchronously`)
  }
}
// rebuildAlgoliaDatabase()

// To search
let algoliaSearchKey = process.env.ALGOLIA_SEARCH_API_KEY // could be public
const searchClient = algoliasearch('HEL1Z7MK9U', algoliaSearchKey);
const searchIndex = searchClient.initIndex('indexName');

export default async function searchWithAlgolia({queryString, hitsPerPage}){
  hitsPerPage = hitsPerPage || 5
  let response = await searchIndex.search(queryString, {
    hitsPerPage,
    getRankingInfo: true
  })
  let results = response.hits  
  return results
}