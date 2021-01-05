import Airtable from "airtable";

export function makeAirtable() {
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
}

export function getTable(tableName) {
  const airtable = makeAirtable();
  return airtable.base("appu1qsfWgYivsvNo")(tableName);
}

export const getRecord = {
  "Narrow Cause Area": {
    id: (r) => r.id,
    name: (r) => r.get("Name"),
    description: (r) => r.get("Description") || null,
    rating: (r) => r.get("Generic Rating") || null,
    image: (r) => (r.get("Image") || []).map((i) => i.url),
  },
};
