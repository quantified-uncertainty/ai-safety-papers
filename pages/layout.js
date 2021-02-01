import Link from "next/link";
import Head from "next/head";

export default function Layout(props) {
  return (
    <div>
      <Head>
        <title>Cause Explorer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <nav className="bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                    alt="Workflow"
                  />
                </div>
                <div className=" md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <Link href={`/`} passHref>
                      <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                        Papers
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main>
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8">{props.children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
