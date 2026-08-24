import { Formik, Form, Field, ErrorMessage } from "formik";
import { Navigate, useNavigate } from "react-router-dom";
import { publicApi } from "../api/api";
import { useAuth } from "../context/AuthContext";

function validateLogin(values) {
  const errors = {};

  if (!values.email) {
    errors.email = "Email is required";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/categories" replace />;
  }

  async function handleLogin(values, formikHelpers) {
    const { setSubmitting, setStatus } = formikHelpers;

    setStatus("");

    try {
      const body = new URLSearchParams();

      body.append("grant_type", "password");
      body.append("client_id", import.meta.env.VITE_CLIENT_ID);
      body.append("client_secret", import.meta.env.VITE_CLIENT_SECRET);
      body.append("scope", import.meta.env.VITE_SCOPE);
      body.append("username", values.email);
      body.append("password", values.password);

      const response = await publicApi.post(
        "/connect/token",
        body,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      login(response.data.access_token);
      navigate("/categories");
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.error_description ||
        error.response?.data?.message ||
        "Login failed.";

      setStatus(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="form-card login-form">
        <h1>Login</h1>
        <p>Sign in to manage categories and users.</p>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validate={validateLogin}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, status }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="email">Email</label>

                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                />

                <ErrorMessage
                  name="email"
                  component="p"
                  className="field-error"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                />

                <ErrorMessage
                  name="password"
                  component="p"
                  className="field-error"
                />
              </div>

              {status && <p className="form-error">{status}</p>}

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </Form>
          )}
        </Formik>
      </section>
    </main>
  );
}