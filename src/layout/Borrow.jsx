import React, { useState, useEffect } from "react";
import axios from "axios";

const BorrowBookForm = () => {
  const [formData, setFormData] = useState({
    memberId: "",
    bookId: "",
    status: "ยืม",
    borrowDate: new Date().toISOString(),
  });

  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [borrows, setBorrows] = useState([]);
  const [memberBorrows, setMemberBorrows] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8889/book/books", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            genre: selectedGenre,
          },
        });

        if (response.status === 200) {
          setBooks(response.data);
        } else {
          console.error("Error fetching books:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching books:", error.message);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8889/member/members",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          setMembers(response.data);
        } else {
          console.error("Error fetching members:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching members:", error.message);
      }
    };

    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }

    fetchBooks();
    fetchMembers();
  }, [selectedGenre]); // ให้ useEffect ทำงานเมื่อ selectedGenre เปลี่ยนแปลง

  useEffect(() => {
    console.log("fetchBorrow");
    const fetchBorrows = async () => {
      try {
        if (!formData.memberId) return;
        const borrowResponse = await axios.get(
          "http://localhost:8889/borrow/borrows",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: { memberId: formData.memberId },
          }
        );
        setBorrows(borrowResponse.data);
      } catch (error) {
        console.error("Error fetching borrows:", error.message);
      }
    };

    console.log(formData.memberId);
    fetchBorrows();
  }, [formData.memberId]);

  useEffect(() => {
    console.log(borrows);
    if (borrows.length > 0) {
      const memberBorrows = borrows.filter(
        (borrow) =>
          Number(borrow.memberId) === Number(formData.memberId) &&
          borrow.status === formData.status
      );
      console.log("Member borrows:", memberBorrows);
      setMemberBorrows(memberBorrows);
    }
  }, [borrows, formData.memberId, formData.status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBorrow = async (e) => {
    e.preventDefault();

    try {
      const selectedMemberId = formData.memberId;

      const response = await axios.post(
        "http://localhost:8889/borrow/borrows",
        {
          ...formData,
          userId: selectedMemberId,
          returnDate: null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);
      alert("หนังสือถูกยืมเรียบร้อยแล้ว");

      setFormData({
        memberId: "",
        bookId: "",
        status: "ยืม",
        borrowDate: new Date().toISOString(),
      });
    } catch (error) {
      console.error(error.message);
      alert("หนังสือถูกยืมครบตามที่กำหนดแล้ว");
    }
  };

  return (
    <div className="p-5  w-4/6 min-w-[500px] mx-auto  mt-5  border-2 border-pink-500 rounded">
      <div className="text-3xl mb-5 font-bold">ยืมคืน</div>
      <form className="flex flex-col gap-2" onSubmit={handleBorrow}>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text font-bold">ชื่อสมาชิก</span>
          </div>
          <select
            name="memberId"
            value={formData.memberId}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs border-pink-500 border-2"
          >
            <option value="">-- เลือก ชื่อสมาชิก --</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-2 font-bold">
          {formData.memberId && (
            <div>
              <strong>จำนวนหนังสือที่ยืมแล้ว:</strong> {memberBorrows.length} เล่ม
            </div>
          )}
        </div>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text font-bold">ประเภทหนังสือ</span>
          </div>
          <select
            name="genre"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="input input-bordered w-full max-w-xs border-pink-500 border-2"
          >
            <option value="">-- เลือก ประเภทหนังสือ --</option>
            {[...new Set(books.map((book) => book.genre))].map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text font-bold">ชื่อหนังสือ</span>
          </div>
          <select
            name="bookId"
            value={formData.bookId}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs border-pink-500 border-2"
          >
            <option value="">-- เลือกหนังสือ --</option>
            {books
              .filter((book) =>
                selectedGenre ? book.genre === selectedGenre : true
              )
              .map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
          </select>
        </label>

        <div className="flex gap-5">
          <button type="submit" className="btn btn-outline btn-info mt-7">
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
};

export default BorrowBookForm;
