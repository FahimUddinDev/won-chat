import * as Yup from "yup";
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Email is required"),
});

export default loginSchema;
