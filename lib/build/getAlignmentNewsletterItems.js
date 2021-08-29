import crypto from "crypto"
import { Tabletojson } from "tabletojson"
import fs from "fs"
import path from "path"

/* Definitions */
let aiSafetyNewsletterHtmlPath = './data/Database.html' //path.resolve(__dirname, '../data/Database.html')

/* Utils */
let id = x => x
let getIfExists = (x, f, alternative) => x ? f(x) : alternative
let getUniqueitems = (array) => [...new Set(array)]
let hashObject = (object) => crypto.createHash('sha512').update(JSON.stringify(object)).digest('hex')
let flush = text => {
    text = text.replaceAll("<br>", "\n")
    text = text ? text.replace(/  +/g, " ") : ""
    text = text.replace(/<.*?>/g, "")
    text = text[0] == " " ? text.slice(1) : text
    text = (text[text.length - 1] == " " || text[text.length - 1] == "\n") ? text.slice(0, text.length - 1) : text
    return text
}
let formatTitle = (title) => {
    let formattedTitle = flush(title)
    if (formattedTitle == "") {
        console.log(title)
    }
    /*
    if(!title.includes(`<a target="_blank" href="`) ){
        console.log(title)
    }*/
    return (formattedTitle)
}
let getUrl = (aHtml) => aHtml.includes(`href="`) ? aHtml.split(`href="`)[1].split(`"`)[0] : ""
let authorsToArray = (authors) => {
    let formattedAuthors = flush(authors.replaceAll("*", ""))
    formattedAuthors = formattedAuthors.split(/,\s*/)
    return formattedAuthors
}
let isHighlighted = (highlightflag) => highlightflag == "Highlight" ? true : false
let formatAnBlurb = ({ summary, summarizer, opinion }) => {
    let anBlurb = summary +
        (opinion ? `\n\n**${summarizer}'s opinion:** ` + opinion : "")
    anBlurb = flush(anBlurb)
    return anBlurb
}

let getProperty = (property, item) => {
    switch (property) {
        case "id":
            delete item["Num"]
            return hashObject(item).toString().slice(0, 17);
        case "title":
            return formatTitle(item["Title"])
        case "url":
            return getUrl(item["Title"])
        case "author":
            return authorsToArray(item["Authors"])
        case "abstractNote":
            return ""
        case "publicationTitle":
            return getIfExists(item["Venue"], flush, "")
        case "anBlurb":
            return formatAnBlurb({
                summary: item["Summary"],
                summarizer: item["Summarizer"],
                opinion: item["My opinion"]
            })
        case "anHighlightFlag":
            return isHighlighted(item["Highlight?"])
        default:
            return "";
    }
}

/* Main */
export default async function getAlignmentNewsletterItems() {
    let html = fs.readFileSync(aiSafetyNewsletterHtmlPath);

    html = html.toString().replace(/<thead>.*<\/thead>/g, "")
    let alignmentNewsletterJSON = await Tabletojson.convert(html, { stripHtmlFromCells: false, useFirstRowForHeadings: true })[0];
    alignmentNewsletterJSON.shift()
    alignmentNewsletterJSON = alignmentNewsletterJSON.filter(item => item["Title"] != "")
    let alignmentNewsletterFormatted = alignmentNewsletterJSON.map(item => {
        return ({
            id: getProperty("id", item),
            title: getProperty("title", item),
            url: getProperty("url", item),
            itemType: "",
            author: getProperty("author", item),
            publicationYear: "",
            citations: 'N/A',
            abstractNote: getProperty("abstractNote", item),
            safetyType: '',
            orgs: [''],
            publicationTitle: getProperty("publicationTitle", item),
            anBlurb: getProperty("anBlurb", item),
            anHighlightFlag: getProperty("anHighlightFlag", item),
            jeremyBlurb: null,
            conferenceName: null
        })
    })
    // console.log(JSON.stringify(alignmentNewsletterFormatted, null, 4))
    // console.log(JSON.stringify(alignmentNewsletterFormatted.map(item => item.title), null, 4))
    return alignmentNewsletterFormatted
}
// getAlignmentNewsletterItems()