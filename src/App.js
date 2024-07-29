import "./App.css";
import TelephonesTable from "./components/Telephones/TelephonesTable";
import { useCallback, useEffect, useState } from "react";
import Registration from "./components/UserRegistration/Registration";
import Button from "./components/UI/Button";
import Login from "./components/UserRegistration/Login";
import SearchTelephones from "./components/Telephones/SearchTelephones";
import AddTelephone from "./components/Telephones/AddTelephone";
import LoadingSpinner from "./components/UI/LoadingSpinner";

function App() {
  const [isLoading, setIsLoading] = useState();
  const [telephones, setTelephones] = useState([]);
  const [error, setError] = useState(null);
  const [login, setLogin] = useState();
  const [register, setRegister] = useState();
  const [search, setSearch] = useState();
  const [selectedTelephone, setSelectedTelephone] = useState(null);

  const fetchTelephonesHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://localhost:44359/api/telefoni");

      if (!response.ok) {
        throw new Error("Failed to delete telephone");
      }

      const data = await response.json();

      const transformedData = data.map((telephones) => {
        return {
          id: telephones.id,
          producerName: telephones.producerName,
          model: telephones.model,
          price: telephones.price,
          availableAmount: telephones.availableAmount,
          operatingSystem: telephones.operatingSystem,
        };
      });
      setTelephones(transformedData);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const fetchDeleteTelephone = useCallback(
    async (id) => {
      try {
        const token = localStorage.getItem("token");
        var headers = { "Content-Type": "application/json" };
        if (token) {
          headers.Authorization = "Bearer " + token;
        }
        const url = "https://localhost:44359/api/telefoni/" + id;
        const response = await fetch(url, {
          method: "DELETE",
          headers: headers,
        });
        if (!response.ok) {
          throw new Error("Failed to delete telephone");
        }
        fetchTelephonesHandler();
      } catch (error) {
        console.error("Error deleting telephone", error.message);
        setError(error.message);
      }
    },
    [fetchTelephonesHandler]
  );

  const editTelephoneHandler = useCallback((telephone) => {
    setSelectedTelephone(telephone);
  }, []);

  let content;

  if (telephones.length === 0 || error) {
    content = <p>Found no telephones</p>;
  }

  if (isLoading) {
    content = (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (telephones.length > 0) {
    content = (
      <div>
        <h2>Telefoni</h2>
        <TelephonesTable
          onEditTelephone={(telephone) => editTelephoneHandler(telephone)}
          onDeleteTelephone={(id) => fetchDeleteTelephone(id)}
          telephones={telephones}
        />
      </div>
    );
  }

  if (error) {
    content = <p>{error}</p>;
  }

  const addRegisterHandler = async (user) => {
    try {
      const registerResponse = await fetch(
        "https://localhost:44359/api/Authentication/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
      );

      if (!registerResponse.ok) {
        const errorMessage = await registerResponse.text();
        alert(errorMessage);
      }
      setLogin(true);
      setRegister(false);
    } catch (error) {
      console.error("Error during registration:", error.message);
      throw error;
    }
  };

  const addLoginHandler = async (user) => {
    try {
      const loginResponse = await fetch(
        "https://localhost:44359/api/Authentication/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
      );

      if (!loginResponse.ok) {
        const errorMessage = await loginResponse.text();
        console.log("Logging failed:", errorMessage);
        alert("Pogresan unos. Pokusajte ponovo.");
        throw new Error("Failed to login user");
      } else {
        const responseBody = await loginResponse.json();
        const token = responseBody.token;
        const username = responseBody.username;

        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
      }

      setLogin(false);
      setRegister(false);
      setSearch(true);
    } catch (error) {
      console.error("Error during logging:", error.message);
      throw error;
    }
  };

  const addSearchHandler = useCallback(async (searchObject) => {
    try {
      const token = localStorage.getItem("token");
      var headers = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = "Bearer " + token;
      }
      const response = await fetch("https://localhost:44359/api/pretraga", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(searchObject),
      });

      if (!response.ok) {
        throw new Error("Something is wrong!");
      }

      const data = await response.json();

      const transformedData = data.map((telephones) => {
        return {
          id: telephones.id,
          producerName: telephones.producerName,
          model: telephones.model,
          price: telephones.price,
          operatingSystem: telephones.operatingSystem,
          availableAmount: telephones.availableAmount,
        };
      });
      setTelephones(transformedData);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  const addTelephoneHandler = useCallback(
    async (telephoneData) => {
      try {
        const token = localStorage.getItem("token");
        var headers = { "Content-Type": "application/json" };
        if (token) {
          headers.Authorization = "Bearer " + token;
        }
        const response = await fetch("https://localhost:44359/api/telefoni", {
          method: "POST",
          headers: headers,
          body: JSON.stringify(telephoneData),
        });

        if (response.status !== 201) {
          throw new Error("Failed to add telephone!!!");
        }
        fetchTelephonesHandler();
      } catch (error) {
        setError(error.message);
      }
    },
    [fetchTelephonesHandler]
  );

  const fetchEditTelephoneHandler = async (id, telephoneData) => {
    try {
      const token = localStorage.getItem("token");
      var headers = { "Content-Type": "application/json" };
      if (token) {
        headers.Authorization = "Bearer " + token;
      }
      const response = await fetch(
        `https://localhost:44359/api/telefoni/${id}`,
        {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(telephoneData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit telephone");
      }

      fetchTelephonesHandler();
    } catch (error) {
      console.error("Error editing telephone:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchTelephonesHandler();
  }, [
    fetchTelephonesHandler,
    addSearchHandler,
    addTelephoneHandler,
    fetchDeleteTelephone,
  ]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      handleLogout();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setLogin(false);
    setRegister(false);
    setSearch(false);
  };

  let openingLook = (
    <section>
      <h1>Korisnik nije prijavljen na sistem</h1>
      <Button onClick={() => setLogin(true)}>Prijava</Button>
      <Button onClick={() => setRegister(true)}>Registracija</Button>
    </section>
  );

  const storedUsername = localStorage.getItem("username");
  let loggedUser = (
    <section>
      <p>Prijavljeni korisnik: {storedUsername}</p>
      <button className="button" onClick={handleLogout}>
        Odjava
      </button>
    </section>
  );

  return (
    <div className="App">
      <header>{storedUsername && loggedUser}</header>
      {!login && !register && !search && openingLook}
      {login && (
        <Login onLogin={addLoginHandler} onCancel={() => setLogin(false)} />
      )}
      {register && (
        <Registration
          onRegister={addRegisterHandler}
          onCancel={() => setRegister(false)}
        />
      )}
      {search && <SearchTelephones onAddSearch={addSearchHandler} />}
      <section>{content}</section>
      {search && (
        <AddTelephone
          telephone={selectedTelephone}
          onAddTelephone={addTelephoneHandler}
          onEditTelephone={fetchEditTelephoneHandler}
        />
      )}
    </div>
  );
}

export default App;
