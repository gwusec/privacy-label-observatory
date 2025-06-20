const Footer = () => {
  return (
    <footer className="footer bg-gray-900 text-gray-200 py-8">
      <div className="footer-content max-w-4xl mx-auto px-4 flex flex-col items-center space-y-4">
        <div className="text-center space-y-2">
          <p>
            This project is funded by the National Science Foundation (NSF). We thank the NSF for their support.
          </p>
          <p>
            Found an issue or have feedback? Please{' '}
            {/* TODO: update with link to public repo/issue */}
            <a
              href="https://github.com/gwusec/pl-obser-sample/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:underline hover:text-blue-300 transition"
            >
              submit an issue on GitHub
            </a>.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;