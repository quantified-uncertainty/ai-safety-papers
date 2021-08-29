## Build steps

1. Download the database from https://docs.google.com/spreadsheets/d/1PwWbWZ6FPqAgZWOoOcXM8N_tUCuxpEyMbN1NYYC02aM/edit?usp=sharing as an html file
    - Click on File > Download > Web page (.html, zipped)
    - Why an html file? It's the only format which preserves links and is easy to parse
    - A csv doesn't preserve links, and an xlsx is not easy to parse
    - Also note that I don't have permissions to clone the database and then extract the links into a column using some Google Sheets function (very annoying)
2. Extract the file into ./data/Database.html
3. Optional: To view it, run `$ tidy -indent Database.html > DatabasePretiffied.html` or some other linter.
    - This makes it more difficult to parse (one has to ignore some, but not all breaks and spaces now), so we won't be using it inside the code.
    - Tidy can be installed from https://www.html-tidy.org/
4. Add `"type": "module"` to the `package.json`
5. Run `$ node lib/build/getData.js`
    - Answer the questions about very similar items.
6. Run `$ ALGOLIA_MASTER_API_KEY="xxx" node lib/build/rebuildAlgolia.js`
7. Remove `"type": "module"` from the `package.json`