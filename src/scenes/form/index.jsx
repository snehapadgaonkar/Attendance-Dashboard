import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { addStudent } from "../../services/api.ts"; 
import { useState } from "react";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await addStudent(values); // Send data to the API
      setSuccessMessage("Student successfully added!"); // Set success message
      resetForm(); // Reset form fields
    } catch (error) {
      console.error("Error adding student:", error);
      setErrorMessage("Failed to add student. Please try again."); // Set error message
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE STUDENT" subtitle="Create a New Student Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
                autoComplete="given-name"
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
                autoComplete="family-name"
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Class"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Class}
                name="Class"
                error={!!touched.Class && !!errors.Class}
                helperText={touched.Class && errors.Class}
                sx={{ gridColumn: "span 4" }} // Span full width
                autoComplete="class"
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Email}
                name="Email"
                error={!!touched.Email && !!errors.Email}
                helperText={touched.Email && errors.Email}
                sx={{ gridColumn: "span 4" }}
                autoComplete="email"
              />
              <TextField
                fullWidth
                variant="filled"
                type="tel"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Phone}
                name="Phone"
                error={!!touched.Phone && !!errors.Phone}
                helperText={touched.Phone && errors.Phone}
                sx={{ gridColumn: "span 4" }}
                autoComplete="tel"
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Student
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* Snackbar for success message */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert onClose={() => setSuccessMessage("")} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Snackbar for error message */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
      >
        <Alert onClose={() => setErrorMessage("")} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Phone number validation regex
const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

// Validation schema
const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  Class: yup.string().required("Class is required"),
  Email: yup.string().email("invalid email").required("required"),
  Phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .max(10, "Phone number must be exactly 10 digits")
    .required("required"),
});

// Initial values
const initialValues = {
  firstName: "",
  lastName: "",
  Email: "",
  Phone: "",
  Class: ""
};

export default Form;
