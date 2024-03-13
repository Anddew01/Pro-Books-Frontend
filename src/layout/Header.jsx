import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const guestNav = [
  { to: "/", text: "เข้าสู่ระบบ" },
  { to: "/register", text: "สมัครสมาชิก" },
];

const userNav = [
  { to: "/home", text: "หน้าหลัก" },
  { to: "/recordList", text: "ประวัติ" },
  { to: "/borrow", text: "ยืมคืน" },
  { to: "/borrowList", text: "รายการยืมคืน" },
  { to: "/book", text: "เพิ่มหนังสือ" },
  { to: "/bookList", text: "รายการหนังสือ" },
  { to: "/member", text: "เพิ่มสมาชิก" },
  { to: "/memberList", text: "รายชื่อสมาชิก" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const finalNav = user?.id ? userNav : guestNav;
  const navigate = useNavigate();

  const hdlLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100">
      <label className="flex cursor-pointer gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
        <input
          type="checkbox"
          value="dracula"
          className="toggle theme-controller"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </label>
      <div className="flex-1">
        {user?.id ? (
          <Link to="/home" className="btn btn-ghost text-xl">
            ยินดีต้อนรับ : {user.username}
          </Link>
        ) : (
          <Link to="/" className="btn btn-ghost text-xl">
            ยินดีต้อนรับ : {user?.id ? user.username : ""}
          </Link>
        )}
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {finalNav.map((el) => (
            <li key={el.to}>
              <Link to={el.to}>{el.text}</Link>
            </li>
          ))}
          {user?.id && (
            <li>
              <Link to="#" onClick={hdlLogout}>
                ออกระบบ
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
