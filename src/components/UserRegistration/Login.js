import { useState, useRef } from "react";

import classes from "./Login.module.css";
import Wrapper from "../Helpers/Wrapper";
import ErrorModal from "../UI/ErrorModal";
import Card from "../UI/Card";
import Button from "../UI/Button";

const Login = (props) => {
  const [error, setError] = useState();

  const usernameRef = useRef();
  const passwordRef = useRef();

  const loginHandler = (event) => {
    event.preventDefault();

    const enteredUsername = usernameRef.current.value;
    const enteredPassword = passwordRef.current.value;

    if (enteredUsername.trim().length === 0) {
      setError({
        title: "Pogresan unos",
        message: "Korisnicko ime ne sme biti prazno",
      });
      return;
    }

    if (enteredPassword.trim().length === 0) {
      setError({
        title: "Pogresan unos",
        message: "Lozinka ne sme biti prazna",
      });
      return;
    }

    const user = {
      username: enteredUsername,
      password: enteredPassword,
    };

    props.onLogin(user);
    usernameRef.current.value = "";
    passwordRef.current.value = "";
  };

  const errorHandler = () => {
    setError(null);
  };
  return (
    <Wrapper>
      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onConfirm={errorHandler}
        />
      )}
      <Card className={classes.input}>
        <form onSubmit={loginHandler}>
          <h1>Prijava korisnika</h1>
          <label htmlFor="username">Korisnicko ime</label>
          <input id="username" type="text" ref={usernameRef} />
          <label htmlFor="password">Lozinka</label>
          <input id="password" type="text" ref={passwordRef} />
          <Button onClick={props.onCancel}>Odustajanje</Button>
          <Button type="submit">Prijavi se</Button>
        </form>
      </Card>
    </Wrapper>
  );
};

export default Login;
