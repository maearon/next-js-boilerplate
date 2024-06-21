import type { NextPage } from 'next';
import Link from 'next/link';

const Footer: NextPage = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container text-center">
        <small>
          The <Link href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">NextJS Tutorial</Link> by <Link href="https://github.com/maearon" target="_blank" rel="noopener noreferrer">maearon</Link>
        </small>
        <nav className="mt-3">
          <ul className="list-inline">
            <li className="list-inline-item"><Link href="/about">About</Link></li>
            <li className="list-inline-item"><Link href="/contact">Contact</Link></li>
            <li className="list-inline-item"><Link href="https://nextjs.org/blog" target="_blank" rel="noopener noreferrer">News</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
