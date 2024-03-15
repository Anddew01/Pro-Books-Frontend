import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment-timezone";

const RecordList = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = localStorage.getItem("token");

        // ดึงข้อมูล Records
        const response = await axios.get(
          "http://localhost:8889/record/records",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ดึงข้อมูล Members
        const membersResponse = await axios.get(
          "http://localhost:8889/member/members",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ดึงข้อมูล Books
        const booksResponse = await axios.get(
          "http://localhost:8889/book/books",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const recordsWithDetails = response.data.map((record) => {
          const member = membersResponse.data.find(
            (member) => member.id === record.memberId
          );

          const book = booksResponse.data.find(
            (book) => book.id === record.bookId
          );

          return {
            ...record,
            member: member || { name: "N/A" },
            book: book || { title: "N/A" },
          };
        });

        setRecords(recordsWithDetails);
      } catch (error) {
        console.error("Error fetching records:", error.message);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="p-5 border w-4/6 min-w-[1000px] mx-auto rounded mt-5 ">
      <h2 className="text-3xl mb-5">ประวัติการยืมคืน</h2>
      <ul>
        {records
          .slice()
          .reverse()
          .map((record) => (
            <li
              key={record.id}
              className="mb-4 p-4 border-2 border-pink-500 rounded"
            >
              <div className="mb-2">ชื่อสมาชิก: {record.member.name}</div>
              <div className="mb-2">ชื่อหนังสือ: {record.book.title}</div>
              <div className="mb-2">สถาณะ: {record.status}</div>
              <div className="mb-2">
                วันที่ยืม:{" "}
                {moment(record.borrowDate).format("DD-MM-YYYY HH:mm:ss")}
              </div>
              <div>
                วันที่คืน:{" "}
                {record.returnDate
                  ? moment(record.returnDate).format("DD-MM-YYYY HH:mm:ss")
                  : "ไม่มีข้อมูลวันคืน"}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RecordList;
