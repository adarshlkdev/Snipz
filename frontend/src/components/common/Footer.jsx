import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="text-white max-lg:hidden">
      <footer className="flex justify-between items-center p-4 h-24">
        <div className="flex-1 text-left">
          <p>
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Snipz
            </span>{" "}
            &copy; {new Date().getFullYear()}{" "}
          </p>
        </div>
        <div className="flex-1 text-center">
          <p>
            Made with ❤️ by{" "}
            <Link
              to="https://adarshlkdev.tech"
              target="_blank"
              className="text-primary"
            >
              adarshlkdev
            </Link>
          </p>
        </div>
        <div className="flex-1 text-right flex justify-end gap-4">
          <Link
            to="https://linkedin.com/in/adarshlkdev"
            target="_blank"
            className="text-primary"
          >
            <FaLinkedin className="w-6 h-6" />
          </Link>
          <Link
            to="https://github.com/adarshlkdev"
            target="_blank"
            className="text-primary"
          >
            <FaGithub className="w-6 h-6" />
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Footer;