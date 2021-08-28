/*
    The purpose of this file is to get 
*/

/*
{
id: 'rec5gqDd2QBUDBMVw',
title: 'Discontinuous progress investigation',
itemType: 'Blog Post',
author: [ 'AI Impacts' ],
publicationYear: '2015',
citations: 'N/A',
abstractNote: 'Published Feb 2, 2015; last updated April 12 2020 We have collected cases of discontinuous technological progress to inform our understanding of whether artificial intelligence performance is likely to undergo such a discontinuity. This page details our investigation. We know of ten events that produced a robust discontinuity in progress equivalent to more than a century...',
url: 'https://aiimpacts.org/discontinuous-progress-investigation/',
safetyType: 'Meta Safety',
orgs: [ 'AI-Impacts' ],
publicationTitle: 'AI Impacts',
anBlurb: null,
anHighlightFlag: false,
jeremyBlurb: null,
conferenceName: null
},
*/
import crypto from "crypto"
import { Tabletojson } from "tabletojson"
import fs from "fs"
import path from "path"

// Utils
let id = x => x
let getIfExists = (x, f, alternative) => x ? f(x) : alternative
let getUniqueitems = (array) => [...new Set(array)]
let hashObject = (object) => crypto.createHash('sha512').update(JSON.stringify(object)).digest('hex')
let flush = text => { 
    text = text.replaceAll("<br>", "\n")
    text = text ? text.replace(/  +/g, " ")/*.replaceAll("\n", " ") */ : ""
    text =  text[0] == " " ? text.slice(1) : text
    text =  ( text[text.length-1] == " " || text[text.length-1] == "\n" ) ? text.slice(0, text.length-1) : text
    return text
}
let logAndFlush = (text) => {console.log(flush(text)); return flush(text)}
let formatTitle = (title) => {
    let formattedTitle = title.replace(/<.*?>/g, "")
    // console.log(title)
    formattedTitle = flush(formattedTitle)
    // console.log(title)
    if(formattedTitle == ""){
        console.log(title)
    }
    return(formattedTitle)
    /*if(!title.includes(`<a target="_blank" href="`) ){
        return logAndFlush(title)    
    }else{
        title = title.split(`<a target="_blank" href="`)[1].split(`">`)[1].replaceAll("</a>", "")
        return flush(title)
    }*/
}
let getUrl = (aHtml) => aHtml.includes(`href="`) ? aHtml.split(`href="`)[1].split(`"`)[0] : ""
let authorsToArray = (authors) => {
    let formattedAuthors = flush(authors).replaceAll("*", "")
    formattedAuthors = formattedAuthors.replace(/<.*?>/g, "")
    return formattedAuthors.split(/,\s*/)
}
let isHighlighted = (highlightflag) => highlightflag == "Highlight" ? true : false
let formatAnBlurb = ({summary, summarizer, opinion}) => {
    let anBlurb = summary +
        (opinion ? `\n\n**${summarizer}'s opinion:** ` + opinion : "")
    anBlurb = flush(anBlurb)
    anBlurb = anBlurb.replace(/<.*?>/g, "")
    return anBlurb
}

let getProperty = (property, item) => {
    switch (property) {
        case "id":
            delete item["Num"]
            return hashObject(item).toString().slice(0,17);
        case "title": 
            return formatTitle(item["Title"])
        case "url": 
            return getUrl(item["Title"])
        case "author":
            return authorsToArray(item["Authors"])
        case "abstractNote":
            return ""
        case "publicationTitle":
            return item["Venue"] || ""
        case "anBlurb":
            return formatAnBlurb({summary: item["Summary"] , summarizer: item["Summarizer"] , opinion: item["My opinion"] })
        case "anHighlightFlag":
            return isHighlighted(item["Highlight?"])
        default:
            return "";
    }
}

// Defs
let aiSafetyNewsletterHtmlPath = './data/Database.html'//path.resolve(__dirname, '../data/Database4.html')

// Main
export default async function getAIAlignmentNewsletterItems(){
    let html = fs.readFileSync(aiSafetyNewsletterHtmlPath);
    
    html = html.toString().replace(/<thead>.*<\/thead>/g, "")
    let aiAlignmentNewsletterJSON = await Tabletojson.convert(html, {stripHtmlFromCells: false, useFirstRowForHeadings: true})[0];
    // console.log(aiAlignmentNewsletterJSON.slice(0,3))
    // console.log(aiAlignmentNewsletterJSON.slice(0,3).map(item => item.Summary.replaceAll("\n", " ").replaceAll("          ", "")))
    aiAlignmentNewsletterJSON.shift()
    aiAlignmentNewsletterJSON = aiAlignmentNewsletterJSON.filter(item => item["Title"] != "")
    let aiAlignmentNewsletterFormatted = aiAlignmentNewsletterJSON.map(item => {
        //console.log(item)
        return({
            id: getProperty("id", item),
            title: getProperty("title", item),
            url: getProperty("url", item),
            itemType: "",
            author: getProperty("author", item),
            publicationYear: "",
            citations: 'N/A',
            abstractNote: getProperty("abstractNote", item),
            safetyType: '',
            orgs: [ '' ],
            publicationTitle: getProperty("publicationTitle", item),
            anBlurb: getProperty("anBlurb", item),
            anHighlightFlag: getProperty("anHighlightFlag", item),
            jeremyBlurb: null,
            conferenceName: null
        })
    })
    // console.log(JSON.stringify(aiAlignmentNewsletterFormatted, null, 4))
    // console.log(JSON.stringify(aiAlignmentNewsletterFormatted.map(item => item.title), null, 4))
    return aiAlignmentNewsletterFormatted
}
// 
// getAIAlignmentNewsletterItems()