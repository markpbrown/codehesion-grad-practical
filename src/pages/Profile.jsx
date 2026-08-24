import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { privateApi } from "../api/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await privateApi.get("/v1/admin/Users/current");

        const currentUser = response.data.data;

        setUser(currentUser);
      } catch (error) {
        console.error(error);
      }
    }

    loadUser();
  }, []);

  async function handleSubmit(values) {
    try {
      await privateApi.put(
        "/v1/admin/Users/current",
        {
          name: values.name,
          lastName: values.lastName,
          email: values.email,
        }
      );

      setUser(values);
      setMessage("Profile updated.");
    } catch (error) {
      console.error(error);
      setMessage("Could not update profile.");
    }
  }

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <section className="page">
      <div className="page-heading">
        <h1>Profile</h1>
        <p>Update your profile information.</p>
      </div>

      <div className="form-card page-form profile-form">
        <Formik
          enableReinitialize
          initialValues={{
            name:
              user.name ??
              "",

            lastName:
              user.lastName ??
              "",

            email:
              user.email ??
              "",
          }}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="form-group">
              <label htmlFor="name">
                First name
              </label>

              <Field
                id="name"
                name="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                Last name
              </label>

              <Field
                id="lastName"
                name="lastName"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

              <Field
                id="email"
                name="email"
                type="email"
              />
            </div>

            <button type="submit">
              Save changes
            </button>

            {message && <p>{message}</p>}
          </Form>
        </Formik>
      </div>
    </section>
  );
}