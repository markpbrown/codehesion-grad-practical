import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import { privateApi } from "../api/api";

export default function CategoryPage() {
  const { categoryId } = useParams();

  const [category, setCategory] = useState(null);

  const [wordName, setWordName] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  async function loadCategory() {
    try {
      setError("");

      const response = await privateApi.get(
        `/v1/admin/categories/${categoryId}`
      );

      console.log(
        "Category response:",
        response.data
      );

      const categoryData =
        response.data?.data ??
        response.data;

      setCategory(categoryData);
    } catch (error) {
      console.error(error);

      setError(
        "Could not load category."
      );
    }
  }

  function getCreatedWordId(data) {
    if (data?.id) {
      return data.id;
    }

    if (data?.data?.id) {
      return data.data.id;
    }

    if (data?.wordId) {
      return data.wordId;
    }

    if (data?.data?.wordId) {
      return data.data.wordId;
    }

    return null;
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
        videoFile
      );

      const createResponse =
        await privateApi.post(
          "/v1/admin/Words",
          formData
        );

      console.log(
        "Create word response:",
        createResponse.data
      );

      const newWordId =
        getCreatedWordId(
          createResponse.data
        );

      if (!newWordId) {
        throw new Error(
          "The API created the word but did not return a word ID."
        );
      }

      await privateApi.put(
        `/v1/admin/Words/${newWordId}`,
        {
          name: wordName.trim(),
        }
      );

      await privateApi.patch(
        `/v1/admin/categories/${categoryId}/words`,
        {
          wordId: newWordId,
        }
      );

      setMessage(
        "Word added successfully."
      );

      setWordName("");
      setVideoFile(null);

      const fileInput =
        document.getElementById(
          "wordVideo"
        );

      if (fileInput) {
        fileInput.value = "";
      }

      await loadCategory();
    } catch (error) {
      console.error(
        "Add word error:",
        error
      );

      console.error(
        "API response:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Could not add word."
      );
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

  const words =
    category.words ??
    category.items ??
    category.wordItems ??
    [];

  return (
    <section className="page">

      <Link
        to="/categories"
        className="back-link"
      >
        Back to categories
      </Link>

      <div className="page-heading">
        <h1>
          {category.name ||
            category.title ||
            `Category ${categoryId}`}
        </h1>

        <p>
          View and add words to this
          category.
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
              id="wordVideo"
              type="file"
              accept="video/*"
              onChange={(event) =>
                setVideoFile(
                  event.target.files[0]
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
              <span>
                {word.name ||
                  `Word ${word.id}`}
              </span>

              <span>
                View
              </span>
            </Link>
          ))}

        </div>
      )}

    </section>
  );
}