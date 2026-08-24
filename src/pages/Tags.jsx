import { useEffect, useState } from "react";
import { privateApi } from "../api/api";

function getValidColor(color) {
  return /^#[0-9A-Fa-f]{6}$/.test(color)
    ? color
    : "#777777";
}

export default function TagsPage() {
  const [tags, setTags] = useState([]);

  const [name, setName] = useState("");
  const [color, setColor] = useState("#777777");

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {
    try {
      const response = await privateApi.get(
        "/v1/admin/Tags"
      );

      setTags(response.data.data.items);
    } catch (error) {
      console.error(error);
      setError("Could not load tags.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Tag name is required.");
      return;
    }

    try {
      setError("");
      setMessage("");

      const tag = {
        name: name.trim(),
        color,
      };

      if (editingId) {
        await privateApi.put(
          `/v1/admin/Tags/${editingId}`,
          tag
        );

        setMessage("Tag updated.");
      } else {
        await privateApi.post(
          "/v1/admin/Tags",
          tag
        );

        setMessage("Tag created.");
      }

      clearForm();
      await loadTags();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Could not save tag."
      );
    }
  }

  function handleEdit(tag) {
    setEditingId(tag.id);
    setName(tag.name);
    setColor(getValidColor(tag.color));

    setError("");
    setMessage("");
  }

  function clearForm() {
    setEditingId(null);
    setName("");
    setColor("#777777");
  }

  async function handleDelete(id) {
    try {
      setError("");
      setMessage("");

      await privateApi.delete(
        `/v1/admin/Tags/${id}`
      );

      setMessage("Tag deleted.");

      await loadTags();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Could not delete tag."
      );
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <h1>Tags</h1>
        <p>Create and manage tags.</p>
      </div>

      <div className="form-card page-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tagName">
              Name
            </label>

            <input
              id="tagName"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="tagColor">
              Color
            </label>

            <input
              id="tagColor"
              type="color"
              value={color}
              onChange={(event) =>
                setColor(event.target.value)
              }
            />
          </div>

          <div className="form-actions">
            <button type="submit">
              {editingId
                ? "Save changes"
                : "Add tag"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}
          </div>

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

      <div className="tag-list">
        {tags.length === 0 ? (
          <p>No tags were found.</p>
        ) : (
          tags.map((tag) => (
            <div
              className="tag-row"
              key={tag.id}
            >
              <div className="tag-info">
                <span
                  className="tag-color"
                  style={{
                    backgroundColor:
                      getValidColor(tag.color),
                  }}
                />

                <span>{tag.name}</span>
              </div>

              <div className="tag-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    handleEdit(tag)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() =>
                    handleDelete(tag.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}