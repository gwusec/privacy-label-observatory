const Footer = () => {
  return (
    <footer className="footer bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-3 border-t border-gray-300 dark:border-gray-700 sticky bottom-0 left-0 right-0 text-sm mt-auto">
      <div className="footer-content max-w-4xl mx-auto px-4 flex flex-col items-center space-y-4">
        <div className="text-center space-y-2">
          <p>
            This project is funded by the National Science Foundation (NSF) under awards{' '}
            <a
              href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=2247951&HistoricalAwards=false"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300 transition"
            >
              2247951
            </a>,{' '}
            <a
              href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=2247952&HistoricalAwards=false"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300 transition"
            >
              2247952
            </a>, and{' '}
            <a
              href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=2247953&HistoricalAwards=false"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300 transition"
            >
              2247953
            </a>. We thank the NSF for their support.
          </p>
          <p>
            Found an issue or have feedback? Please{' '}
            {/* TODO: update with link to public repo/issue */}
            <a
              href="https://github.com/gwusec/pl-obser-sample/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300 transition"
            >
              open an issue on GitHub
            </a>.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;