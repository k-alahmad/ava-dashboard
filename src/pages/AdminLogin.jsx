import * as React from "react";
import {
  Button,
  Avatar,
  CssBaseline,
  Box,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { showMessage } from "../redux/messageAction.slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../redux/auth/authSlice";
import { useLoginMutation } from "../redux/auth/authApiSlice";
import Message from "../components/MessagePopUp/Message";
import { systemSettings } from "../settings";
const defaultForm = {
  userName: "",
  password: "",
};
const SignIn = () => {
  const navigate = useNavigate();
  const [form, setForm] = React.useState(defaultForm);
  const dispatch = useDispatch();
  const [passwordError, setPasswordError] = React.useState("");
  const [userNameError, setUserNameError] = React.useState("");
  const [login, { isLoading: loading }] = useLoginMutation();
  function handleChangeEmail(e) {
    setUserNameError("");
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
    let EmailRegExp = true;

    EmailRegExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ).test(e.target.value);

    if (!EmailRegExp) {
      setUserNameError("Email Is Not Valid");
    }
  }

  function handleChangePassword(e) {
    setPasswordError("");
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

    if (e.target.value.length <= 5) {
      setPasswordError("passowrd must be 6 charecters or more");
    }
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({
        email: form.userName,
        password: form.password,
      }).unwrap();
      // console.log(userData);
      dispatch(setCredentials(userData));
      setForm(defaultForm);
      navigate("/");
    } catch (error) {
      dispatch(
        showMessage({
          message: "Wrong User Name Or Password",
          variant: "error",
        })
      );
    }
  };

  return (
    <div>
      <Message />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: systemSettings.colors.primary }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            <b> ADMIN </b> LOGIN
          </Typography>
          <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="userName"
              label="Email"
              name="userName"
              autoComplete="userName"
              autoFocus
              type="email"
              onChange={handleChangeEmail}
              error={Boolean(userNameError)}
              helperText={userNameError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChangePassword}
              error={Boolean(passwordError)}
              helperText={passwordError}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{ background: systemSettings.colors.primary }}
              disabled={
                loading ||
                Boolean(passwordError) ||
                Boolean(userNameError) ||
                form.password === "" ||
                form.userName === ""
              }
            >
              {loading ? <CircularProgress color="inherit" /> : "Login"}
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};
export default SignIn;
