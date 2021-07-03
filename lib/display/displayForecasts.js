/* Imports */
import { markdownRenderer } from "./markdownRenderer.js";
import { getstars } from "./helperDisplayFunctions.js";

/* Definitions */

/* Support functions */

let cleanText = (text) => {
  // Note: should no longer be necessary
  let textString = !!text ? text : "";
  textString = textString
    .replaceAll("] (", "](")
    .replaceAll(") )", "))")
    .replaceAll("( [", "([")
    .replaceAll(") ,", "),")
    .replaceAll("==", "") // Denotes a title in markdown
    .replaceAll("Background\n", "")
    .replaceAll("Context\n", "")
    .replaceAll("--- \n", "- ")
    .replaceAll(/\[(.*?)\]\(.*?\)/g, "$1");
  textString = textString.slice(0, 1) == "=" ? textString.slice(1) : textString;
  //console.log(textString)
  return textString;
};

let truncateText = (length, text) =>
  text.length > length ? text.slice(0, length) + "..." : text;

let displayMarkdown = (description) => {
  let formatted = truncateText(250, cleanText(description));
  // overflow-hidden overflow-ellipsis h-24
  return formatted === "" ? (
    ""
  ) : (
      <div className="overflow-clip">
        <div
            dangerouslySetInnerHTML={{ __html: markdownRenderer(formatted) }}
        />
      </div>
    );
};

let formatProbability = (probability) => {
  let percentage = (probability * 100)
  let percentageCapped = percentage < 1 ? "< 1%" : (percentage > 99 ? "> 99%" : percentage.toFixed(0) + "%")
  return percentageCapped
}

let generateRow = (option) => {
  let chooseColor = (probability) => {
    if (probability < 0.1) {
      return "bg-blue-50 text-blue-500";
    } else if (probability < 0.3) {
      return "bg-blue-100 text-blue-600";
    } else if (probability < 0.7) {
      return "bg-blue-200 text-blue-700";
    } else {
      return "bg-blue-300 text-blue-800";
    }
  };

  return (
    <div className="items-center flex">
      <div
        className={`${chooseColor(
          option.probability
        )} w-14 flex-none rounded-md py-0.5 my-1 text-sm text-center`}
      >
        {formatProbability(option.probability)}
      </div>
      <div className="flex-auto text-gray-700 pl-3 leading-snug text-sm">
        {option.name}
      </div>
    </div>
  );
};

let formatForecastOptions = (options) => {
  let optionsSorted = options.sort((a,b) => b.probability - a.probability)
  let optionsMax5 = optionsSorted.slice(0,5) // display max 5 options.
  let result = optionsMax5.map((option) => generateRow(option))
  return result;
};

let metaculusEmbed = (item) => {
  //console.log(item.url)
  let embedurl = item.url.replace("questions", "questions/embed").split("/");
  embedurl.pop();
  embedurl.pop();
  embedurl = embedurl.join("/");

  return (
    <div
      key={item.title}
      className="flex flex-col px-4 py-3 bg-white rounded-md shadow place-content-stretch flex-grow place-self-center"
    >
      <div className="justify-self-center place-self-center">
        <iframe
          className={`h-${item.title.length > 80 ? 72 : 60
            } justify-self-center self-center`}
          src={embedurl}
        />
      </div>

      {forecastFooter(item.qualityindicators.stars, item.platform, item.qualityindicators.numforecasts)}
    </div>
  );
};

let numerateForecasts = (number, platform) => {
  if (!!number && platform !== "Guesstimate") {
    return (
      <>
        <span className="inline-block font-bold">{number}</span>
        <span className="text-gray-400">
          {number == 1 ? "\u00a0Forecast" : "\u00a0Forecasts"}
        </span>
      </>
    );
  } else if (platform === "Guesstimate") {
    return <span className="text-gray-400">1 Model</span>;
  }
};

let forecastFooter = (stars, platform, numforecasts) => {
  // flex grid w-full align-bottom items-end self-end text-center mt-2 align-self-end bg-black self-end
  // grid text-center flex-col align-bottom
  return (
    <div className="flex-1 text-gray-500">
      <div className="inline-block mr-5 text-yellow-400 opacity-80">
        {getstars(stars)}
      </div>
      <div className="inline-block font-bold mr-4 text-sm">
        {platform.replaceAll(" ", "\u00a0")}
      </div>
      {platform !== ""}
      <div className="inline-block text-sm">
        {numerateForecasts(numforecasts, platform)}
      </div>
    </div>
  );
};

/* Body */
let primaryForecastColor = (probability) => {
  if (probability < 0.03) {
    return "bg-red-600";
  } else if (probability < 0.1) {
    return "bg-red-600 opacity-80";
  } else if (probability < 0.2) {
    return "bg-red-600 opacity-70";
  } else if (probability < 0.3) {
    return "bg-red-600 opacity-60";
  } else if (probability < 0.4) {
    return "bg-red-600 opacity-50";
  } else if (probability < 0.5) {
    return "bg-gray-500";
  } else if (probability < 0.6) {
    return "bg-gray-500";
  } else if (probability < 0.7) {
    return "bg-green-600 opacity-50";
  } else if (probability < 0.8) {
    return "bg-green-600 opacity-60";
  } else if (probability < 0.9) {
    return "bg-green-600 opacity-70";
  } else if (probability < 0.97) {
    return "bg-green-600 opacity-80";
  } else {
    return "bg-green-600";
  }
};
let textColor = (probability) => {
  if (probability < 0.03) {
    return "text-red-600";
  } else if (probability < 0.1) {
    return "text-red-600 opacity-80";
  } else if (probability < 0.2) {
    return "text-red-600 opacity-80";
  } else if (probability < 0.3) {
    return "text-red-600 opacity-70";
  } else if (probability < 0.4) {
    return "text-red-600 opacity-70";
  } else if (probability < 0.5) {
    return "text-gray-500";
  } else if (probability < 0.6) {
    return "text-gray-500";
  } else if (probability < 0.7) {
    return "text-green-600 opacity-70";
  } else if (probability < 0.8) {
    return "text-green-600 opacity-70";
  } else if (probability < 0.9) {
    return "text-green-600 opacity-80";
  } else if (probability < 0.97) {
    return "text-green-600 opacity-80";
  } else {
    return "text-green-600";
  }
};

let primaryEstimateAsText = (probability) => {
  if (probability < 0.03) {
    return "Exceptionally unlikely";
  } else if (probability < 0.1) {
    return "Very unlikely";
  } else if (probability < 0.4) {
    return "Unlikely";
  } else if (probability < 0.6) {
    return "About Even";
  } else if (probability < 0.9) {
    return "Likely";
  } else if (probability < 0.97) {
    return "Very likely";
  } else {
    return "Virtually certain";
  }
};

let textColorFromScore = (score) => {
  if (score < 0.4) {
    return ["text-gray-900", "text-gray-900"];
  } else {
    return ["text-gray-400", "text-gray-400"];
  }
}

let opacityFromScore = (score) => {
  //if (score < 0.4) {
    return "opacity-100";
  //} else {
  //  return "opacity-50";
  //}
}

let displayForecast = ({
  title,
  url,
  platform,
  author,
  description,
  options,
  qualityindicators,
  visualization,
  score
}) => (
  <a
    key={title}
    href={url}
    className="hover:bg-gray-100 hover:no-underline cursor-pointer flex flex-col px-4 py-3 bg-white rounded-md shadow place-content-stretch flex-grow no-underline"
    target="_blank"
  >
    <div className="flex-grow">
      <div className={`text-gray-900 ${opacityFromScore(score)} text-lg mb-2 font-medium justify-self-start`}>
        {title.replace("</a>", "")}
      </div>
      {(options.length == 2 && (options[0].name == "Yes" || options[0].name == "No")) && (
        <div className="mb-5 mt-2 block">
          <span
            className={`${primaryForecastColor(
              options[0].probability
            )} text-white w-16 rounded-md px-1.5 py-0.5 font-bold text-center `}
          >
            {formatProbability(options[0].probability)}
          </span>
          <span
            className={`${textColor(
              options[0].probability
            )} ml-2 text-gray-500 inline-block`}
          >
            {primaryEstimateAsText(options[0].probability)}
          </span>
        </div>
      )}
      {( options.length != 2 || (options[0].name != "Yes" && options[0].name != "No")) && (
        <div className={`mb-2 mt-2 ${opacityFromScore(score)}`}>
          {formatForecastOptions(options)}
        </div>
      )}

      {platform !== "Guesstimate" && options.length < 3 && (
        <div className={`text-gray-500 ${opacityFromScore(score)}`}>
          {displayMarkdown(description)}
        </div>
      )}

      {platform === "Guesstimate" && (
        <img
          className="rounded-sm mb-1"
          src={visualization}
          alt="Guesstimate Screenshot"
        />
      )}
    </div>
    <div className={`flex ${opacityFromScore(score)}`}>{forecastFooter(qualityindicators.stars, author || platform, qualityindicators.numforecasts)}</div>
  </a>
);

export default function displayForecasts(results) {
  return (
    !!results.map &&
    results.map((item) => {
        console.log(item)
        return displayForecast(item)
    })
  );
}
