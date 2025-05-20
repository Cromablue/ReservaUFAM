import React, { useState } from 'react';
import axios from 'axios';

const UserForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    cpf: '',
    siape: '',
    role: 'user',
    status: 'active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/users/', formData);
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input type='text' name='username' placeholder='Username' value={formData.username} onChange={handleChange} className='border p-2 rounded' required />
      <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} className='border p-2 rounded' required />
      <input type='text' name='cpf' placeholder='CPF (11 digits)' value={formData.cpf} onChange={handleChange} className='border p-2 rounded' required />
      <input type='text' name='siape' placeholder='SIAPE (7 digits)' value={formData.siape} onChange={handleChange} className='border p-2 rounded' required />
      <select name='role' value={formData.role} onChange={handleChange} className='border p-2 rounded'>
        <option value='user'>User</option>
        <option value='admin'>Admin</option>
      </select>
      <select name='status' value={formData.status} onChange={handleChange} className='border p-2 rounded'>
        <option value='active'>Active</option>
        <option value='inactive'>Inactive</option>
      </select>
      <button type='submit' className='bg-blue-500 text-white p-2 rounded'>Create User</button>
    </form>
  );
};

export default UserForm;
