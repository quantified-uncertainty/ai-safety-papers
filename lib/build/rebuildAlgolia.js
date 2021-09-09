import fs from "fs"
import { getData } from "./getData.js";
import algoliasearch from "algoliasearch";

let algoliaMasterKey = process.env.ALGOLIA_MASTER_API_KEY;
const databaseClient = algoliasearch("HEL1Z7MK9U", algoliaMasterKey);
const databaseIndex = databaseClient.initIndex("ai-safety-papers-main");
let databasePath = './data/database.json'//path.resolve(__dirname, '../data/Database4.html')

export async function rebuildAlgoliaDatabase() {
  let records = await getData() //JSON.parse(fs.readFileSync(databasePath)) //
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
