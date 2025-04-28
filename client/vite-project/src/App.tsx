import { useState, useEffect } from "react";
import axios from "axios";
import { catDB, catFormData } from "./types/catDbType";
import { FormStateType } from "./types/formActiveType";

import "./App.css";

function App() {
  const [catDb, setCatDb] = useState<catDB[]>([]);
  const [isFormActive, setIsFormActive] = useState<FormStateType>({
    state: false,
    event: "none",
  });
  const defaultFormData: catFormData = {
    name: "",
    age: 0,
    gender: "Male",
    breed: "",
    imageUrl: "",
  };
  const [formData, setFormData] = useState<catFormData>(defaultFormData);

  const [updateTargetId, setUpdateTargetId] = useState<string>("");

  const fetchCatData = async () => {
    const response = await axios.get<catDB[]>("http://localhost:3000/cats");
    console.log(response.data);
    setCatDb(response.data);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    isFormActive.event === "update" ? handleUpdate() : handleAdd();
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post("http://localhost:3000/add-cat", {
        ...formData,
      });
      if (response.status === 201) {
        await fetchCatData();
        setIsFormActive({ state: false, event: "none" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/delete-cat/${id}`
      );
      if (response.status === 200) {
        fetchCatData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/update-cat/${updateTargetId}`,
        {
          ...formData,
        }
      );
      if (response.status === 200) {
        await fetchCatData();
        setIsFormActive({ state: false, event: "none" });
        setUpdateTargetId("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateFormData = async (catInfo: catDB) => {
    setIsFormActive({ state: true, event: "update" });
    const { name, age, breed, gender, imageUrl, _id } = catInfo;
    setUpdateTargetId(_id);
    setFormData({
      name: name,
      age: age,
      gender: gender,
      breed: breed,
      imageUrl: imageUrl,
    });
  };

  useEffect(() => {
    fetchCatData();
  }, []);

  return (
    <>
      <button onClick={() => setIsFormActive({ state: true, event: "add" })}>
        Add a cat
      </button>
      {catDb.map((cat) => {
        return (
          <div className="flex" key={cat._id}>
            <h2>{cat.name}</h2>
            <button onClick={() => handleDelete(cat._id)}>Delete</button>
            <button onClick={() => updateFormData(cat)}>Update</button>
          </div>
        );
      })}

      {isFormActive.state && (
        <form
          onSubmit={(e) => handleFormSubmit(e)}
          className="flex flex-col gap-3"
        >
          <label className="text-start" htmlFor="cat-name">
            Name
          </label>
          <input
            className="border-2 border-black pl-1.5 placeholder:text-white"
            type="text"
            id="cat-name"
            placeholder="Name"
            onChange={(e) => handleChange(e)}
            value={formData.name}
            name="name"
            required
          />
          <label htmlFor="cat-age"></label>
          <input
            className="border-2 border-black pl-1.5 placeholder:text-white"
            type="number"
            id="cat-age"
            placeholder="Age"
            onChange={(e) => handleChange(e)}
            value={formData.age}
            name="age"
            required
          />
          <label htmlFor="gender-select"></label>
          <select
            className="border-2 border-black pl-1.5 placeholder:text-white"
            name="gender"
            id="gender-select"
            onChange={(e) => handleChange(e)}
            value={formData.gender}
            required
          >
            <option className="bg-black" value="Male">
              Male
            </option>
            <option className="bg-black" value="Female">
              Female
            </option>
          </select>
          <label htmlFor="cat-breed"></label>
          <input
            className="border-2 border-black pl-1.5 placeholder:text-white"
            type="text"
            id="cat-breed"
            placeholder="Breed"
            onChange={(e) => handleChange(e)}
            value={formData.breed}
            name="breed"
            required
          />
          <label htmlFor="image-url"></label>
          <input
            className="border-2 border-black pl-1.5 placeholder:text-white"
            type="text"
            id="image-url"
            placeholder="Image Url"
            onChange={(e) => handleChange(e)}
            value={formData.imageUrl}
            name="imageUrl"
          />
          <button type="submit">Submit</button>
          <button
            onClick={() => {
              setIsFormActive({ state: false, event: "none" });
            }}
          >
            Decline
          </button>
        </form>
      )}
    </>
  );
}

export default App;
