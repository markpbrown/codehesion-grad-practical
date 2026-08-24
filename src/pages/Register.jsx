import { ErrorMessage, Field, Form, Formik } from "formik";
import { privateApi } from "../api/api";

function validateRegistration(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required";
  }

  if (!values.surname.trim()) {
    errors.surname = "Surname is required";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
  ) {
    errors.email = "Enter a valid email";
  }

  if (!values.role) {
    errors.role = "Role is required";
  }

  return errors;
}

export default function RegisterPage() {
  async function handleRegister(values, formikHelpers) {
    const {
      resetForm,
      setStatus,
      setSubmitting,
    } = formikHelpers;

    setStatus(null);

    try {
      const requestBody = {
        name: values.name.trim(),
        surname: values.surname.trim(),
        email: values.email.trim(),
        role: values.role,
      };

      await privateApi.post("/v1/admin/Users", requestBody);

      resetForm();

      setStatus({
        type: "success",
        message: "Invitation sent successfully.",
      });
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Could not invite the user.";

      setStatus({
        type: "error",
        message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <h1>Invite a user</h1>
        <p>Send an invitation to a new user.</p>
      </div>

      <div className="form-card register-form">
        <Formik
          initialValues={{
            name: "",
            surname: "",
            email: "",
            role: "Administrator",
          }}
          validate={validateRegistration}
          onSubmit={handleRegister}
        >
          {({ isSubmitting, status }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="name">First name</label>
                <Field id="name" name="name" />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="field-error"
                />
              </div>

              <div className="form-group">
                <label htmlFor="surname">Surname</label>
                <Field id="surname" name="surname" />
                <ErrorMessage
                  name="surname"
                  component="p"
                  className="field-error"
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-email">Email</label>
                <Field
                  id="register-email"
                  name="email"
                  type="email"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="field-error"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>

                <Field 
                  id="role"
                  name="role"
                  type="text"
                  placeholder="Admin">
                </Field>

                <ErrorMessage
                  name="role"
                  component="p"
                  className="field-error"
                />
              </div>

              {status?.message && (
                <p
                  className={
                    status.type === "success"
                      ? "form-success"
                      : "form-error"
                  }
                >
                  {status.message}
                </p>
              )}

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Sending invitation..."
                  : "Invite user"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}