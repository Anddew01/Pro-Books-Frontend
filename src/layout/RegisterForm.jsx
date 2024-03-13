import axios from "axios";
import { useState } from "react";

export default function RegisterForm() {
  const [input, setInput] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Validation
      if (input.password !== input.confirmPassword) {
        return alert("กรุณาตรวจสอบรหัสผ่านอีกครั้ง");
      }
      const response = await axios.post("http://localhost:8889/auth/register", {
        username: input.username,
        password: input.password,
        confirmPassword: input.confirmPassword,
        email: input.email,
      });

      console.log(response);

      if (response.status === 200) {
        alert("ลงทะเบียนสำเร็จ");

        // Reset input fields to empty values
        setInput({
          username: "",
          password: "",
          confirmPassword: "",
          email: "",
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-5 border w-4/6 min-w-[500px] mx-auto rounded mt-5">
      <div className="text-3xl mb-5">สมัครสมาชิก</div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        {["username", "password", "confirmPassword", "email"].map(
          (fieldName) => (
            <label key={fieldName} className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">
                  {fieldName === "username" && "ชื่อผู้ใช้"}
                  {fieldName === "password" && "รหัสผ่าน"}
                  {fieldName === "confirmPassword" && "ยืนยันรหัสผ่าน"}
                  {fieldName === "email" && "อีเมล"}
                </span>
              </div>
              <input
                type={
                  fieldName === "password" || fieldName === "confirmPassword"
                    ? "password"
                    : "text"
                }
                className="input input-bordered w-full max-w-xs"
                name={fieldName}
                value={input[fieldName]}
                onChange={handleChange}
              />
            </label>
          )
        )}
        <div className="flex gap-5">
          <button type="submit" className="btn btn-outline btn-info mt-7">
            ยืนยัน
          </button>
        </div>
      </form>
    </div>
  );
}
