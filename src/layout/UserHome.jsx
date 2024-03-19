// UserHome.jsx
import React from "react";

const UserHome = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://vrthaimagazine.com.au/wp-content/uploads/2023/07/cover2-scaled.jpg')",
      }}
    >
      <div className="text-center">
        <h1 className="text-7xl font-bold mb-6 text-purple-500">
          ยืมคืนหนังสือ
        </h1>
        <p className="text-2xl text-white mb-10">
          ยินดีต้อนรับสู่ระบบยืมคืนหนังสือของเรา
        </p>
      </div>
    </div>
  );
};

export default UserHome;
