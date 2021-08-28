let compareIfExists = (a,b) => a && b ? a.toLowerCase() == b.toLowerCase() : false

export function processAlignmentNewsletterBlurb({ blurb, papers }) {
  let finalBlurb = blurb;
  let regexp = /(<@(.*?)@>)(\(@(.*?)@\))?/g;
  let matches = [...blurb.matchAll(regexp)];
  //console.log(matches)
  for (let match of matches) {
    let wholeMatch = match[0];
    if (wholeMatch.includes("(@")) {
      //console.log(match)
      let comment = match[2];
      let paperTitle = match[4];
      let matchingPapers = papers.filter((paper) => paper.title.toLowerCase() == paperTitle.toLowerCase() || compareIfExists(paper.altTitle, paperTitle));
      //console.log(matchingPapers)
      if (matchingPapers.length > 0) {
        let firstMatchingPaper = matchingPapers[0];
        let matchingPaperUrl = firstMatchingPaper.url;
        finalBlurb = finalBlurb.replace(
          wholeMatch,
          `${comment} (see: [${paperTitle}](${matchingPaperUrl}))`
        );
      } else {
        finalBlurb = finalBlurb.replace(
          wholeMatch,
          `${comment} (cf. ${paperTitle})`
        );
      }
    } else {
      //console.log(match)
      let paperTitle = match[2];
      let matchingPapers = papers.filter((paper) => paper.title == paperTitle);
      //console.log(matchingPapers)
      if (matchingPapers.length > 0) {
        let firstMatchingPaper = matchingPapers[0];
        let matchingPaperUrl = firstMatchingPaper.url;
        finalBlurb = finalBlurb.replace(
          wholeMatch,
          `[${paperTitle}](${matchingPaperUrl})`
        );
      } else {
        finalBlurb = finalBlurb.replace(wholeMatch, `*${paperTitle}*`);
      }
    }
  }
  //console.log(finalBlurb)
  return finalBlurb;
}

/* Testing
// Test in the final app by searching for a paper with weird Rohin symbols, like "How can Interpretability help Alignment?"
import { getData } from "../lib/getData.js";
const { papers } = await getData();
//console.log(papers)

let blurb = `Interpretability seems to be useful for a wide variety of AI alignment proposals. Presumably, different proposals require different kinds of interpretability. This post analyzes this question to allow researchers to prioritize across different kinds of interpretability research.

At a high level, interpretability can either make our current experiments more informative to help us answer research questions (e.g. “when I set up a <@debate@>(@AI safety via debate@) in this particular way, does honesty win?”), or it could be used as part of an alignment technique to train AI systems. The former only have to be done once (to answer the question), and so we can spend a lot of effort on them, while the latter must be efficient in order to be competitive with other AI algorithms.

The Authors then analyze how interpretability could apply to several alignment techniques, and come to several tentative conclusions. For example, they suggest that for recursive techniques like iterated amplification, we may want comparative interpretability, that can explain the changes between models (e.g. between distillation steps, in iterated amplification). They also suggest that by having interpretability techniques that can be used by other ML models, we can regularize a trained model to be aligned, without requiring a human in the loop.
`

let blurb2 = `Interpretability seems to be useful for a wide variety of AI alignment proposals. Presumably, different proposals require different kinds of interpretability. This post analyzes this question to allow researchers to prioritize across different kinds of interpretability research.

At a high level, interpretability can either make our current experiments more informative to help us answer research questions (e.g. “when I set up a <@AI safety via debate@> in this particular way, does honesty win?”), or it could be used as part of an alignment technique to train AI systems. The former only have to be done once (to answer the question), and so we can spend a lot of effort on them, while the latter must be efficient in order to be competitive with other AI algorithms.

The Authors then analyze how interpretability could apply to several alignment techniques, and come to several tentative conclusions. For example, they suggest that for recursive techniques like iterated amplification, we may want comparative interpretability, that can explain the changes between models (e.g. between distillation steps, in iterated amplification). They also suggest that by having interpretability techniques that can be used by other ML models, we can regularize a trained model to be aligned, without requiring a human in the loop.
`
processBlurb({blurb, papers})
processBlurb({blurb: blurb2, papers})
*/
