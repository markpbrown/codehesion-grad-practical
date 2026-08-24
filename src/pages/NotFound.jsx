import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="page">
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/categories">Return to categories</Link>
    </section>
  );
}