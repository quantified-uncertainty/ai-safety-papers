import Link from "next/link";
import Head from "next/head";
import { GiPapers } from "react-icons/gi";

const appName = "AI Safety Papers";
const iconLocation = "/papers.png";
const Icon = GiPapers;
const feedbackPage =
  "https://github.com/QURIresearch/ai-safety-papers/discussions";

export default function Layout(props) {
  const classNameSelected = (isSelected) =>
    `text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-sm text-md font-medium cursor-pointer ${isSelected ? "bg-gray-700 hover:bg-gray-900" : ""
    }`;
  return (
    <div>
      <Head>
        <title>{appName}</title>
        <link rel="icon" href={iconLocation} />
      </Head>

      <div>
        <nav className="header">
          <div className="px-2">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0"></div>
                <div className="md:block flex items-baseline text-gray-100 hover:text-gray-300 font-medium text-xl mr-10 pl-2 cursor-pointer">
                  <Link href={`/`} passHref>
                    <span className="flex items-center">
                      <span className="mr-2">
                        <Icon />
                      </span>
                      {appName}
                    </span>
                  </Link>
                </div>
                <div className="md:block">
                  <div className="ml-2 flex items-baseline space-x-4">
                    <Link href={`/`} passHref>
                      <span
                        className={classNameSelected(props.page === "search")}
                      >
                        Search
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="md:block">
                  <div className="ml-2 flex items-baseline space-x-4">
                    <Link href={`/about`} passHref>
                      <span
                        className={classNameSelected(props.page === "about")}
                      >
                        About
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="md:block">
                  <div className="ml-2 flex items-baseline space-x-4">
                    <Link href={`/table`} passHref>
                      <span
                        className={classNameSelected(props.page === "table")}
                      >
                        Table
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="md:block">
                  <div className="ml-2 flex items-baseline space-x-4">
                    <a
                      href={
                        "https://github.com/QURIresearch/ai-safety-papers/discussions"
                      }
                      className={classNameSelected(false)}
                      target="_blank"
                    >
                      Feedback
                    </a>
                  </div>
                </div>
              </div>
              <div className="md:block">
                <div className="hidden sm:inline-flex items-center text-gray-100 mr-2">
                  <svg className="ml-4 mr-0 mt-1" height="10" width="16">
                    <circle cx="4" cy="4" r="4" fill="#6eb33e"></circle>
                  </svg>
                  <span>Last Updated 12-19-2020</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main>{props.children}</main>
      </div>
    </div>
  );
}
