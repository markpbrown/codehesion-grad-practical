import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { privateApi } from "../api/api";

function getArrayFromResponse(data) {

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        setError("");

        const response = await privateApi.get(
          "/v1/admin/categories"
        );

        const categoryList = getArrayFromResponse(
          response.data
        );

        setCategories(categoryList);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Could not load categories."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (isLoading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p className="form-error">{error}</p>;
  }

  return (
    <section className="page">
      <div className="page-heading">
        <h1>Categories</h1>
        <p>Select a category to view its words.</p>
      </div>

      {categories.length === 0 ? (
        <p>No categories were found.</p>
      ) : (
        <div className="card-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="category-card"
            >
              <h2>
                {category.name ||
                  category.title ||
                  `Category ${category.id}`}
              </h2>

              {category.description && (
                <p>{category.description}</p>
              )}

              <span>View words</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}