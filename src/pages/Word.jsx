import { useEffect, useState } from "react";
import {Link, useParams,} from "react-router-dom";
import { privateApi } from "../api/api";

function getWords(category) {
  if (Array.isArray(category?.words)) {
    return category.words;
  }

  if (Array.isArray(category?.data?.words)) {
    return category.data.words;
  }

  return [];
}

export default function CategoryPage() {
  const { categoryId } = useParams();

  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategory() {
      try {
        setIsLoading(true);
        setError("");

        const response = await privateApi.get(
          `/v1/admin/categories/${categoryId}`
        );

        const categoryData =
          response.data?.data || response.data;

        setCategory(categoryData);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Could not load this category."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadCategory();
  }, [categoryId]);

  if (isLoading) {
    return <p>Loading category...</p>;
  }

  if (error) {
    return <p className="form-error">{error}</p>;
  }

  if (!category) {
    return <p>Category not found.</p>;
  }

  const words = getWords(category);

  return (
    <section className="page">
      <Link to="/categories" className="back-link">
        Back to categories
      </Link>

      <div className="page-heading">
        <h1>
          {category.name ||
            category.title ||
            `Category ${categoryId}`}
        </h1>

        {category.description && (
          <p>{category.description}</p>
        )}
      </div>

      <h2>Words</h2>

      {words.length === 0 ? (
        <p>This category does not contain any words.</p>
      ) : (
        <div className="word-list">
          {words.map((word) => (
            <Link
              key={word.id}
              to={`/categories/${categoryId}/words/${word.id}`}
              className="word-item"
            >
              <span>
                {word.name ||
                  word.title ||
                  `Word ${word.id}`}
              </span>

              <span>View</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}