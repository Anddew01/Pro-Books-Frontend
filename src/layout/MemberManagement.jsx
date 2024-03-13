import React, { useEffect, useState } from "react";
import axios from "axios";
import AddMemberForm from "./MemberForm";
import EditMemberForm from "./EditMemberForm";

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8889/member/members",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMembers(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchMembers();
  }, []);

  const handleAdd = (newMember) => {
    setMembers([...members, newMember]);
    setShowAddForm(false);
  };

  const handleEditMember = (editedMember) => {
    setMembers(
      members.map((member) =>
        member.id === editedMember.id ? editedMember : member
      )
    );
    setShowEditForm(false);
  };

  const handleDelete = async (memberId) => {
    try {
      const shouldDelete = window.confirm("คุณแน่ใจหรือไม่ที่จะลบรายการนี้?");
      if (!shouldDelete) {
        return;
      }
      await axios.delete(`http://localhost:8889/member/members/${memberId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMembers(members.filter((member) => member.id !== memberId));
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="p-5 border w-4/6 min-w-[1000px] mx-auto rounded mt-5">
      {showEditForm && (
        <EditMemberForm
          memberId={editMemberId}
          onClose={() => setShowEditForm(false)}
          onEdit={handleEditMember}
        />
      )}
      <h2 className="text-3xl m-5">รายชื่อสมาชิก</h2>
      <ul>
        {members.map((member) => (
          <li key={member.id} className="mb-2">
            <div className="m-1">เลขบัตร: {member.memberIdCard}</div>
            <div className="m-1 mb-3">ชื่อ: {member.name}</div>
            <div className="m-1 mb-3">ที่อยู่: {member.address}</div>
            <div>
              <button
                onClick={() => {
                  setShowEditForm(true);
                  setEditMemberId(member.id);
                }}
                className="btn btn-outline btn-info btn-sm mr-2 ml-2 mb-2"
              >
                แก้ไข
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="btn btn-outline btn-info btn-sm"
              >
                ลบสมาชิก
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showAddForm && <AddMemberForm onAdd={handleAdd} />}
    </div>
  );
};

export default MemberManagement;
