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
    <div className="p-5 border w-4/6 min-w-[500px] mx-auto rounded mt-5">
      <form onSubmit={handleRegister} className="flex flex-col gap-2">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">เลขบัตร</span>
          </div>
          <input
            type="text"
            name="memberIdCard"
            value={formData.memberIdCard}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs"
          />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">ชื่อ</span>
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs"
          />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">ที่อยู่</span>
          </div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs"
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
