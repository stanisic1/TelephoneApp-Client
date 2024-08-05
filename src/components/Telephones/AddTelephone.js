import React, { useState, useEffect } from "react";
import classes from "./AddTelephone.module.css";
import Card from "../UI/Card";
import Wrapper from "../Helpers/Wrapper";
import ErrorModal from "../UI/ErrorModal";

const AddTelephone = (props) => {
  const { telephone, onAddTelephone, onEditTelephone } = props;

  const [error, setError] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [model, setModel] = useState(telephone ? telephone.model : "");
  const [os, setOs] = useState(telephone ? telephone.operatingSystem : "");
  const [amount, setAmount] = useState(
    telephone ? telephone.availableAmount : ""
  );
  const [price, setPrice] = useState(telephone ? telephone.price : "");
  const [producers, setProducers] = useState([]);
  const [selectedProducer, setSelectedProducer] = useState(
    telephone ? telephone.producerId : ""
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    var headers = {};
    if (token) {
      headers.Authorization = "Bearer " + token;
    }
    fetch("https://localhost:44359/api/proizvodjaci", { headers: headers })
      .then((response) => response.json())
      .then((data) => {
        setProducers(data);
      })
      .catch((error) => {
        console.error("Error fetching producers:", error);
      });
    if (telephone) {
      setIsEditing(true);
      setModel(telephone.model);
      setOs(telephone.operatingSystem);
      setAmount(telephone.availableAmount);
      setPrice(telephone.price);
      setSelectedProducer(telephone.producerId);
    }
  }, [telephone]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      model.trim().length === 0 ||
      os.trim().length === 0 ||
      amount === "" ||
      price === ""
    ) {
      setError({
        title: "Pogresan unos",
        message: "Sva polja moraju biti popunjena",
      });
      return;
    }

    let telephoneData;

    if (isEditing) {
      telephoneData = {
        id: telephone.id,
        model: model,
        availableAmount: amount,
        price: price,
        operatingSystem: os,
        producerId: selectedProducer,
      };
      onEditTelephone(telephone.id, telephoneData);
    } else {
      telephoneData = {
        model: model,
        availableAmount: amount,
        price: price,
        operatingSystem: os,
        producerId: selectedProducer,
      };
      onAddTelephone(telephoneData);
    }

    clearForm();
    setIsEditing(false);
  };

  const clearForm = () => {
    setModel("");
    setAmount("");
    setPrice("");
    setOs("");
    setSelectedProducer("");
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
        <h3>{isEditing ? "Izmena telefona" : "Dodavanje novog telefona"}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="modelInput">Model</label>
            <input
              type="text"
              id="modelInput"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="osInput">OS</label>
            <input
              type="text"
              id="osInput"
              value={os}
              onChange={(e) => setOs(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="amountInput">Kolicina</label>
            <input
              type="number"
              id="amountInput"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="priceInput">Cena</label>
            <input
              type="number"
              id="priceInput"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="producerSelect">Proizvodjac</label>
            <select
              id="producerSelect"
              value={selectedProducer}
              onChange={(e) => setSelectedProducer(e.target.value)}
              required
            >
              <option value=""></option>
              {producers.map((producer) => (
                <option key={producer.id} value={producer.id}>
                  {producer.name}
                </option>
              ))}
            </select>
          </div>

          <div className={classes.buttonContainer}>
            <button className={classes.button} type="submit">
              {isEditing ? "Izmena" : "Dodavanje"}
            </button>
            <button className={classes.buttonClear} onClick={clearForm}>
              Odustajanje
            </button>
          </div>
        </form>
      </Card>
    </Wrapper>
  );
};

export default AddTelephone;
