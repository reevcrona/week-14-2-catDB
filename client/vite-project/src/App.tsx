import { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

function App() {
  const [catDb, setCatDb] = useState([]);

  const fetchCatData = async () => {
    const response = await axios.get("http://localhost:3000/cats");
    console.log(response.data);
  };

  useEffect(() => {
    fetchCatData();
  }, []);

  return <></>;
}

export default App;
