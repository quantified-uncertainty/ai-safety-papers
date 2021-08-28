Donwload as html
Prettify using html tool: https://codebeautify.org/htmlviewer

// xmllint --format --html Database.html > Database2.html 2>&1
tidy Database.html > Database2.html
Then convert the html table to a json

tidy -indent Database.html > Database2.html
Then delete the first row (with letters)

node lib/getProps/getAIAlignmentNewsletterItems.js > data/ANdatabase.json
node lib/getProps/getData.js > data/fullDatabase.json

// None necessary any more; just download the database as an html from Rohin
// https://docs.google.com/spreadsheets/d/1PwWbWZ6FPqAgZWOoOcXM8N_tUCuxpEyMbN1NYYC02aM/edit?usp=sharing