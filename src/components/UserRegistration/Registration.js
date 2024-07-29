import { useRef, useState } from "react";
import Button from "../UI/Button";
import Card from "../UI/Card";
import classes from "./Registration.module.css";
import Wrapper from "../Helpers/Wrapper";
import ErrorModal from "../UI/ErrorModal";

const Registration = (props) => {
  const [error, setError] = useState();

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const registerHandler = (event) => {
    event.preventDefault();
    const enteredUsername = usernameRef.current.value;
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    const enteredPasswordConfirm = passwordConfirmRef.current.value;

    if (enteredUsername.trim().length === 0) {
      setError({
        title: "Pogresan unos",
        message: "Korisnicko ime ne sme biti prazno",
      });
      return;
    }
    if (enteredEmail.trim().length === 0 || !enteredEmail.includes("@")) {
      setError({
        title: "Pogresan unos",
        message: "Unesite ispravan e-mail",
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
    if (enteredPassword !== enteredPasswordConfirm) {
      setError({
        title: "Pogresan unos",
        message: "Lozinka treba da se poklapa.",
      });
      return;
    }

    const user = {
      username: enteredUsername,
      email: enteredEmail,
      password: enteredPassword,
    };

    props.onRegister(user);
    usernameRef.current.value = "";
    emailRef.current.value = "";
    passwordRef.current.value = "";
    passwordConfirmRef.current.value = "";
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
        <form onSubmit={registerHandler}>
          <h1>Registracija korisnika</h1>
          <label htmlFor="username">Korisnicko ime</label>
          <input id="username" type="text" ref={usernameRef} />
          <label htmlFor="email">E mail</label>
          <input id="email" type="text" ref={emailRef} />
          <label htmlFor="password">Lozinka</label>
          <input id="password" type="text" ref={passwordRef} />
          <label htmlFor="passwordConfirm">Potvrdi lozinku</label>
          <input id="passwordConfirm" type="text" ref={passwordConfirmRef} />
          <Button onClick={props.onCancel}>Odustajanje</Button>
          <Button type="submit">Registruj se</Button>
        </form>
      </Card>
    </Wrapper>
  );
};

export default Registration;
