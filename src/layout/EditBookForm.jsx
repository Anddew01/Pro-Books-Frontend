import React, { useState, useEffect } from "react";
import axios from "axios";

const EditBookForm = ({ bookId, onClose, onEdit }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    pageCount: 0,
  });

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8889/book/books/${bookId}`
        );
        setFormData(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditBook = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:8889/book/books/${bookId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onEdit(response.data);
      onClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-5 border w-4/6 min-w-[500px] mx-auto rounded mt-5">
      <div className="text-3xl mb-5">แก้ไขหนังสือ</div>
      <form
        className="flex flex-col gap-2 md:flex-row md:gap-4"
        onSubmit={handleEditBook}
      >
        <label className="form-control flex-grow max-w-xs">
          <div className="label">
            <span className="label-text">ชื่อหนังสือ</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>

        <label className="form-control flex-grow max-w-xs">
          <div className="label">
            <span className="label-text">ชื่อผู้แต่ง</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
        </label>

        <label className="form-control flex-grow max-w-xs">
          <div className="label">
            <span className="label-text">ประเภท</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          />
        </label>

        <label className="form-control flex-grow max-w-xs">
          <div className="label">
            <span className="label-text">จำนวนหน้า</span>
          </div>
          <input
            type="number"
            className="input input-bordered w-full max-w-xs"
            name="pageCount"
            value={formData.pageCount}
            onChange={handleChange}
          />
        </label>

        <div className="flex gap-5 mt-5 md:mt-0">
          <button type="submit" className="btn btn-outline btn-info">
            บันทึก
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-danger"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBookForm;