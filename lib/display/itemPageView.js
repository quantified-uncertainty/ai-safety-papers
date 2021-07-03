import React from "react";
import { markdownRenderer } from "./markdownRenderer.js";
import displayForecasts from "./displayForecasts.js";
import { getstars } from "./helperDisplayFunctions.js";

function tableOfEvaluations(evaluations){
  return(
    <div>
      <table className="table-auto">
        <thead className="">
        <tr>
          <th className="px-4 py-4">Title</th>
          <th className="px-2">Author</th>
          <th className="px-2">tl;dr</th>
          <th className="px-2">Evaluation quality</th>
        </tr>
        </thead>
        <tbody>
          {evaluations.map((evaluation, i) => (
              <tr>
                <td className="px-4 py-4">
                  <a href={evaluation.url} target="_blank" className="underline text-blue-600 hover:text-blue-800">{evaluation.title}</a>
                  
                </td>
                <td className="px-2">
                  {evaluation.author}
                </td>
                <td className="px-2">
                  {evaluation.summary}
                </td>
                <td className="px-2 text-yellow-400 opacity-80">
                  {getstars(evaluation.stars)}
                </td>
              </tr>
          ))}
        </tbody>
      </table>
  </div>)
}

function tableOfPublications(publications){
  return(
    <div>
      <table className="table-auto">
        <thead className="">
        <tr>
          <th className="px-4 py-4">Title</th>
          <th className="px-2">Authors</th>
          <th className="px-2">Publication Details</th>
        </tr>
        </thead>
        <tbody>
          {publications.map((publication, i) => (
              <tr>
                <td className="px-4 py-4">
                  <a href={publication.url} target="_blank" className="underline text-blue-600 hover:text-blue-800">{publication.title}</a>
                  
                </td>
                <td className="px-2">
                  {publication.authors}
                </td>
                <td className="px-2">
                  {publication.location}
                </td>
              </tr>
          ))}
        </tbody>
      </table>
  </div>)
}

function displayCoreData(item){
  return(
    <div>
      <p>Quick data:</p>
      <ul class="list-disc px-10">
        <li>{`Mission statement: ${item.missionStatement || "unknown"}`}</li>
        <li>{`Yearly budget: ${item.yearlyBudget || "unknown"}`}</li>
        <li>
          Number of staff: <a href={item.teamPage} target="_blank" className="underline text-blue-600 hover:text-blue-800">{`${item.teamMembers ? item.teamMembers.length : "unknown"}`}</a>  
        </li>
      </ul>
    </div>

  )
}

export default function ItemPageView({
    id,
    title,
    url,
    EAforumTag,
    publicationsPage,
    publications,
    teamPage,
    evaluations,
    forecasts,
    missionStatement, 
    yearlyBudget, 
    teamMembers,
    genericMarkdownContent
  }){
  return (
    <div key={id} className="container mx-auto pt-10 max-w-5xl">
      <h2 className="pb-2 text-gray-900 text-3xl">
        <a href={url} target="_blank">{title}</a>
      </h2>

      <div className="text-gray-400 pb-2 italic">
        <a href={url} target="_blank">{url}</a>, <a href={EAforumTag} target="_blank">{EAforumTag}</a>, <a href={publicationsPage} target="_blank">{publicationsPage}</a>
      </div>
      <br/>
      &nbsp;

      {displayCoreData({missionStatement, yearlyBudget, teamPage, teamMembers})}
      <br/>
      &nbsp;

      <h3 className="pb-2 text-gray-900 text-2xl justify-self-center">Publications</h3>
      {tableOfPublications(publications)}
      <br/>
      &nbsp;

      <h3 className="pb-2 text-gray-900 text-2xl justify-self-center">Evaluations</h3>
      {tableOfEvaluations(evaluations)}
      <br/>
      &nbsp;

      <h3 className="pb-2 text-gray-900 text-2xl justify-self-center">Forecasts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayForecasts(forecasts)}
      </div>      
      <br/>
      &nbsp;

      {genericMarkdownContent && (
        <div className="prose text-gray-700 bg-neutral-100 text-neutral-600 mt-4 mb-5 max-w-5xl">
          {genericMarkdownContent && (
            <div
              dangerouslySetInnerHTML={{ __html: markdownRenderer(genericMarkdownContent) }}
            />
          )}
        </div>
      )}
    </div>
  );
};
  