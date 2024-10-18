import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser, updateUser, addUser } from '../services/userService';
import { User } from '../types/User';
import UserForm from './UserForm';
import { FaEdit, FaTrash } from 'react-icons/fa';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      const userList = await fetchUsers();
      setUsers(userList);
    };
    loadUsers();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    setUsers(users.filter(user => user.id !== id));
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleAddOrUpdate = async (user: User) => {
    if (editingUser) {
      await updateUser(user);
      setUsers(users.map(u => (u.id === user.id ? user : u)));
    } else {
      const newUser = await addUser(user);
      setUsers([...users, newUser]);
    }
    setEditingUser(null);
  };

  return (
    <div className="container mt-4">
      <h1>User Management</h1>
      <UserForm user={editingUser} onSubmit={handleAddOrUpdate} />
      <ul className="list-group mt-4">
        {users.map(user => (
          <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{user.name}</strong> - {user.email}
            </div>
            <div>
              <button className="btn btn-warning btn-sm" onClick={() => handleEdit(user)}>
                <FaEdit /> Edit
              </button>
              <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(user.id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
