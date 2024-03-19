import axios from "axios";
import { useState } from "react";
import { createBrowserHistory } from 'history';

const LoginForm = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    const history = createBrowserHistory();

    try {
      e.preventDefault();
      // Validation
      if (!input.username || !input.password) {
        return alert("Please enter both username and password");
      }

      const response = await axios.post("http://localhost:8889/auth/login",input);
      console.log(response.data.token);

      localStorage.setItem("token", response.data.token);

      const userResponse = await axios.get("http://localhost:8889/auth/me", {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });

      console.log(userResponse.data);
      // เมื่อล็อกอินสำเร็จ ให้เปลี่ยนเส้นทางไปยังหน้า Home
      history.push("/home");
      // รีเฟรชหน้าเว็บ
      window.location.reload();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-5 border w-4/6 min-w-[500px] mx-auto mt-5 border-pink-500 rounded">
      <div className="text-3xl mb-5 font-bold">เข้าสู่ระบบ</div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text font-bold">ชื่อผู้ใช้</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs border-pink-500 border-2"
            name="username"
            value={input.username}
            onChange={handleChange}
          />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text font-bold">รหัสผ่าน</span>
          </div>
          <input
            type="password"
            className="input input-bordered w-full max-w-xs border-pink-500 border-2"
            name="password"
            value={input.password}
            onChange={handleChange}
          />
        </label>

        <div className="flex gap-5">
          <button type="submit" className="btn btn-outline btn-info mt-7">
            เข้าสู่ระบบ
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
