import { useState, useEffect } from "react";
import axios from "axios";
import { catDB, catFormData } from "./types/catDbType";
import { FormStateType } from "./types/formActiveType";
import { FaPencilAlt } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";

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
      <h1 className="mb-6 font-bold">MeowDB</h1>
      {!isFormActive.state && (
        <div className="mb-8">
          <button
            className="text-xl bg-green-500 px-6 py-4 rounded-xl font-bold cursor-pointer transition-transform duration-300 hover:-translate-y-1"
            onClick={() => setIsFormActive({ state: true, event: "add" })}
          >
            Add a cat
          </button>
        </div>
      )}

      {!isFormActive.state && (
        <div className="flex gap-20 flex-wrap justify-center ">
          {catDb.map((cat) => {
            return (
              <div
                className="flex items-center w-[310px] h-[410px] flex-col rounded-2xl bg-white "
                key={cat._id}
              >
                <div className="w-full ">
                  <img
                    className="w-full rounded-t-lg h-48 object-cover"
                    src={cat.imageUrl}
                  ></img>
                </div>
                <div className="w-full">
                  <h2 className="text-black text-3xl font-medium text-center mt-4 mb-3">
                    {cat.name}
                  </h2>
                  <div className="text-black grid grid-cols-2 gap-2 mb-4 text-lg">
                    <div className="flex gap-2 justify-center">
                      <h3 className="font-bold">Age:</h3>
                      <span className="text-[#64748b] font-medium">
                        {cat.age}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <h3 className="font-bold">Gender:</h3>
                      <span className="text-[#64748b] font-medium">
                        {cat.gender}
                      </span>
                    </div>
                    <div className="flex gap-2 col-span-2 justify-self-center">
                      <h3 className="font-bold">Breed:</h3>
                      <span className="text-[#64748b]">{cat.breed}</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-2 w-full px-4">
                    <button
                      className="bg-[#dc2626] font-bold cursor-pointer flex items-center gap-1.5 px-6 py-2 w-full rounded-lg transition-transform duration-300 hover:-translate-y-1"
                      onClick={() => handleDelete(cat._id)}
                    >
                      <FaRegTrashCan />
                      Remove
                    </button>
                    <button
                      className="flex items-center gap-1.5 font-bold cursor-pointer bg-[#6d28d9] px-6 py-2 w-full rounded-lg transition-transform duration-300 hover:-translate-y-1"
                      onClick={() => updateFormData(cat)}
                    >
                      <FaPencilAlt /> Update
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isFormActive.state && (
        <form
          onSubmit={(e) => handleFormSubmit(e)}
          className="flex flex-col gap-3 text-xl"
        >
          <div className="flex flex-col ">
            <label className="text-start" htmlFor="cat-name">
              Name *
            </label>
            <input
              className="border-2 border-black pl-1.5 placeholder:text-[#64748b] p-2"
              type="text"
              id="cat-name"
              placeholder="E.g. Mittens"
              onChange={(e) => handleChange(e)}
              value={formData.name}
              name="name"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-start" htmlFor="cat-age">
              Age *
            </label>
            <input
              className="border-2 border-black pl-1.5 placeholder:text-[#64748b] p-2"
              type="number"
              id="cat-age"
              placeholder="2"
              onChange={(e) => handleChange(e)}
              value={formData.age}
              name="age"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-start" htmlFor="gender-select">
              Gender *
            </label>
            <select
              className="border-2 border-black pl-1.5 placeholder:text-[#64748b] p-2"
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
          </div>
          <div className="flex flex-col">
            <label className="text-start" htmlFor="cat-breed">
              Breed *
            </label>
            <input
              className="border-2 border-black pl-1.5 placeholder:text-[#64748b] p-2"
              type="text"
              id="cat-breed"
              placeholder="E.g. Maine Coon"
              onChange={(e) => handleChange(e)}
              value={formData.breed}
              name="breed"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-start" htmlFor="image-url">
              Image Url
            </label>
            <input
              className="border-2 border-black pl-1.5 placeholder:text-[#64748b] p-2"
              type="text"
              id="image-url"
              placeholder="https://placekitten.com/400/300"
              onChange={(e) => handleChange(e)}
              value={formData.imageUrl}
              name="imageUrl"
            />
          </div>

          <button
            className="bg-green-600 text-xl font-bold p-2 cursor-pointer hover:bg-green-800 transition-colors duration-200"
            type="submit"
          >
            Submit
          </button>
          <button
            className="bg-blue-600 text-xl  font-bold p-2 cursor-pointer hover:bg-blue-800 transition-colors duration-200"
            onClick={() => {
              {
                setIsFormActive({ state: false, event: "none" });
                setFormData(defaultFormData);
              }
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
