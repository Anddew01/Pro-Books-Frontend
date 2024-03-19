import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment-timezone";

const BorrowManagement = () => {
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const token = localStorage.getItem("token");

        const borrowResponse = await axios.get(
          "http://localhost:8889/borrow/borrows",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const membersResponse = await axios.get(
          "http://localhost:8889/member/members",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const booksResponse = await axios.get(
          "http://localhost:8889/book/books",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const borrowDataWithDetails = borrowResponse.data.map((borrow) => {
          const book = booksResponse.data.find(
            (book) => book.id === borrow.bookId
          );
          const member = membersResponse.data.find(
            (member) => member.id === borrow.memberId
          );

          return {
            ...borrow,
            bookTitle: book ? book.title : "N/A",
            memberIdCard: member ? member.memberIdCard : "N/A",
            memberName: member ? member.name : "N/A",
            memberAddress: member ? member.address : "N/A",
          };
        });

        setBorrows(borrowDataWithDetails);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchBorrows();
  }, []);

  const handleReturn = async (bookId) => {
    try {
      const shouldReturn = window.confirm(
        "คุณแน่ใจหรือไม่ที่จะทำการคืนหนังสือ?"
      );
      if (!shouldReturn) {
        return;
      }

      const thaiCurrentDate = moment().tz("Asia/Bangkok").format();
      await axios.post(
        `http://localhost:8889/borrow/return/${bookId}`,
        { status: "คืน", returnDate: thaiCurrentDate },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setBorrows((borrows) =>
        borrows.map((borrow) =>
          borrow.id === bookId
            ? { ...borrow, status: "คืน", returnDate: thaiCurrentDate }
            : borrow
        )
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      const shouldDelete = window.confirm("คุณแน่ใจหรือไม่ที่จะลบรายการนี้?");
      if (!shouldDelete) {
        return;
      }

      await axios.delete(`http://localhost:8889/borrow/borrows/${bookId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setBorrows((borrows) => borrows.filter((borrow) => borrow.id !== bookId));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-5  w-4/6 min-w-[1000px] mx-auto  mt-5  ">
      <h2 className="text-3xl mb-5 font-bold">การยืมคืนหนังสือ</h2>
      <ul>
        {borrows
          .slice()
          .reverse()
          .map((borrow) => (
            <li
              key={borrow.id}
              className="mb-4 p-4 border-2 border-pink-500 rounded"
            >
              <div className="m-1 mb-3">ชื่อหนังสือ : {borrow.bookTitle}</div>
              <div className="m-1 mb-3">เลขบัตร : {borrow.memberIdCard}</div>
              <div className="m-1 mb-3">ชื่อสมาชิก : {borrow.memberName}</div>
              <div className="m-1 mb-3">ที่อยู่ : {borrow.memberAddress}</div>
              <div className="m-1 mb-3">
                วันที่ยืม :{" "}
                {moment(borrow.borrowDate).format("DD-MM-YYYY HH:mm:ss")}
              </div>
              <div
                className={`m-1 mb-3 ${
                  moment(borrow.returnDate).isAfter(
                    moment(borrow.borrowDate).add(3, "days")
                  )
                    ? "text-red-500 font-bold"
                    : ""
                }`}
              >
                วันที่คืน :{" "}
                {borrow.returnDate
                  ? moment(borrow.returnDate).format("DD-MM-YYYY HH:mm:ss")
                  : "ไม่มีข้อมูลวันคืน"}
                {moment(borrow.returnDate).isAfter(
                  moment(borrow.borrowDate).add(3, "days")
                ) && (
                  <span className="text-red-500 font-bold">
                    {" "}
                    (เสียค่าปรับ{" "}
                    {5 *
                      (moment(borrow.returnDate).diff(
                        moment(borrow.borrowDate),
                        "days"
                      ) -
                        2)}{" "}
                    บาท)
                  </span>
                )}
              </div>
              <div className="m-1 mb-3">สถานะ : {borrow.status}</div>
              <div className="flex mb-2">
                {borrow.status === "ยืม" && (
                  <button
                    onClick={() => handleReturn(borrow.id)}
                    className="btn btn-outline btn-info btn-sm mr-2"
                  >
                    คืนหนีงสือ
                  </button>
                )}
                <button
                  onClick={() => handleDelete(borrow.id)}
                  className="btn btn-outline btn-info btn-sm"
                >
                  ลบรายการ
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default BorrowManagement;
