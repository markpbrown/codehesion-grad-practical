import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { privateApi } from "../api/api";

export default function CategoryPage() {
  const { categoryId } = useParams();

  const [category, setCategory] = useState(null);
  const [wordName, setWordName] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  async function loadCategory() {
    try {
      setError("");

      const response = await privateApi.get(
        `/v1/admin/categories/${categoryId}`
      );

      setCategory(response.data.data);
    } catch (error) {
      console.error(error);
      setError("Could not load category.");
    }
  }

  async function handleAddWord(event) {
    event.preventDefault();

    if (!wordName.trim()) {
      setError("Word name is required.");
      return;
    }

    if (!videoFile) {
      setError("Please select a video.");
      return;
    }

    try {
      setError("");
      setMessage("");
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append(
        "files",
        videoFile,
        videoFile.name
      );

      const createResponse = await privateApi.post(
        "/v1/admin/Words",
        formData
      );

      const newWordId =
        createResponse.data.data[0];

      if (!newWordId) {
        throw new Error(
          "Could not get the new word ID."
        );
      }

      await privateApi.put(
        `/v1/admin/Words/${newWordId}`,
        {
          name: wordName.trim(),
          categoryIds: [
            Number(categoryId),
          ],
        }
      );

      setWordName("");
      setVideoFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setMessage(
        "Word added successfully."
      );

      await loadCategory();
    } catch (error) {
      console.error(
        "Add word error:",
        error
      );

      console.error(
        "API error:",
        error.response?.data
      );

      const validationErrors =
        error.response?.data?.errors;

      if (validationErrors) {
        const firstError =
          Object.values(
            validationErrors
          )[0]?.[0];

        setError(
          firstError ||
            "Validation failed."
        );
      } else {
        setError(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Could not add word."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!category) {
    return (
      <section className="page">
        {error ? (
          <p className="form-error">
            {error}
          </p>
        ) : (
          <p>Loading category...</p>
        )}
      </section>
    );
  }

  const words = category.words || [];

  return (
    <section className="page">
      <Link
        to="/categories"
        className="back-link"
      >
        Back to categories
      </Link>

      <div className="page-heading">
        <h1>{category.name}</h1>

        <p>
          View and add words to this category.
        </p>
      </div>

      <div className="form-card page-form">
        <h2>Add word</h2>

        <form onSubmit={handleAddWord}>
          <div className="form-group">
            <label htmlFor="wordName">
              Word
            </label>

            <input
              id="wordName"
              type="text"
              value={wordName}
              onChange={(event) =>
                setWordName(
                  event.target.value
                )
              }
              placeholder="Enter new word"
            />
          </div>

          <div className="form-group">
            <label htmlFor="wordVideo">
              Video
            </label>

            <input
              ref={fileInputRef}
              id="wordVideo"
              type="file"
              accept="video/*"
              onChange={(event) =>
                setVideoFile(
                  event.target.files[0] ||
                    null
                )
              }
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Adding..."
              : "Add word"}
          </button>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          {message && (
            <p className="success-message">
              {message}
            </p>
          )}
        </form>
      </div>

      <h2 className="section-heading">
        Words
      </h2>

      {words.length === 0 ? (
        <p>
          No words in this category.
        </p>
      ) : (
        <div className="word-list">
          {words.map((word) => (
            <Link
              key={word.id}
              to={`/categories/${categoryId}/words/${word.id}`}
              className="word-item"
            >
              <span>{word.name}</span>
              <span>View</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}