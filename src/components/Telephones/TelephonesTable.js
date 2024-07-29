import classes from "./TelephonesTable.module.css";

const TelephonesTable = (props) => {
  const token = localStorage.getItem("token");

  const handleDeleteTelephone = (telephoneId) => {
    props.onDeleteTelephone(telephoneId);
  };

  const handleEditTelephone = (telephone) => {
    props.onEditTelephone(telephone);
  };

  return (
    <table className={classes["telephones-table"]}>
      <thead>
        <tr>
          <th>Proizvodjac</th>
          <th>Model</th>
          <th>Cena (din)</th>
          <th>Kolicina</th>
          {token && <th>OS</th>}
          {token && <th>Akcija</th>}
        </tr>
      </thead>
      <tbody>
        {props.telephones.map((telephone) => (
          <tr key={telephone.id}>
            <td>{telephone.producerName}</td>
            <td>{telephone.model}</td>
            <td>{telephone.price}</td>
            <td>{telephone.availableAmount}</td>
            {token && <td>{telephone.operatingSystem}</td>}
            {token && (
              <td>
                <div className={classes["action-buttons"]}>
                  <button
                    className={classes.button}
                    onClick={() => handleEditTelephone(telephone)}
                  >
                    Izmeni
                  </button>
                  <button
                    className={classes.button}
                    onClick={() => handleDeleteTelephone(telephone.id)}
                  >
                    Obrisi
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TelephonesTable;
