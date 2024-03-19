//MemberForm.jsx
import axios from "axios";
import { useState } from "react";

const MemberForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    memberIdCard: "",
    name: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8889/member/members",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);
      alert("สมัครสมาชิกแล้ว");

      setFormData({
        memberIdCard: "",
        name: "",
        address: "",
      });

      // เรียก callback ที่ส่งมาจาก parent component
      onAdd(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-5  w-4/6 min-w-[500px] mx-auto  mt-5  border-2 border-pink-500 rounded">
      <h2 className="text-3xl mb-5 font-bold">เพิ่มสมาชิก</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-2">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text font-bold">เลขบัตร</span>
          </div>
          <input
            type="text"
            name="memberIdCard"
            value={formData.memberIdCard}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs border-pink-500 border-2"
          />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text font-bold">ชื่อ</span>
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs border-pink-500 border-2"
          />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text font-bold">ที่อยู่</span>
          </div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs border-pink-500 border-2"
          />
        </label>

        <div className="flex gap-5">
          <button type="submit" className="btn btn-outline btn-info mt-7">
            สมัครสมาชิก
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
