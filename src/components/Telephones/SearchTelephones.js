import { useRef, useState } from "react";

import Wrapper from "../Helpers/Wrapper";
import ErrorModal from "../UI/ErrorModal";
import Card from "../UI/Card";
import Button from "../UI/Button";
import classes from "./SearchTelephones.module.css";

const SearchTelephones = (props) => {
  const [error, setError] = useState();

  const lowestPriceRef = useRef();
  const biggestPriceRef = useRef();

  const searchHandler = (event) => {
    event.preventDefault();

    const enteredLowestPrice = lowestPriceRef.current.value;
    const enteredBiggestPrice = biggestPriceRef.current.value;

    if (+enteredLowestPrice > +enteredBiggestPrice) {
      setError({
        title: "Pogresan unos",
        message: "Najmanja cena ne sme biti veca od najvise!",
      });
    }

    const searchObject = {
      min: enteredLowestPrice,
      max: enteredBiggestPrice,
    };

    props.onAddSearch(searchObject);

    lowestPriceRef.current.value = "";
    biggestPriceRef.current.value = "";
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
        <form onSubmit={searchHandler}>
          <h3>Pretraga telefona po ceni</h3>
          <label>Najmanje (din.)</label>
          <input id="lowest" type="number" ref={lowestPriceRef} />
          <label>Najvise (din.)</label>
          <input id="biggest" type="number" ref={biggestPriceRef} />
          <Button type="submit">Trazi</Button>
        </form>
      </Card>
    </Wrapper>
  );
};

export default SearchTelephones;
