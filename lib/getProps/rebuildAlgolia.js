import fs from "fs"
import { getData } from "./getData.js";
import algoliasearch from "algoliasearch";

let algoliaMasterKey = process.env.ALGOLIA_MASTER_API_KEY;
const databaseClient = algoliasearch("HEL1Z7MK9U", algoliaMasterKey);
const databaseIndex = databaseClient.initIndex("ai-safety-papers-main");
let fullDatabasePath = './data/fullDatabase.json'//path.resolve(__dirname, '../data/Database4.html')

export async function rebuildAlgoliaDatabase() {
  let records = JSON.parse(fs.readFileSync(fullDatabasePath)) // await getData() //// 
  records = records.map((record, index) => ({ ...record, objectID: index }));

  if (databaseIndex.exists()) {
    console.log("Index exists");
    databaseIndex
      .replaceAllObjects(records, { safe: true })
      .catch((error) => console.log(error));
    console.log(
      `Pushed ${records.length} records. Algolia will update asynchronously`
    );
  }
}
rebuildAlgoliaDatabase()
