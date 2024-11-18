import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/api';
import Swal from 'sweetalert2';

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ChangePasswordFormData>();
  const newPassword = watch('newPassword');

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setError('');
      
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      
      await Swal.fire({
        icon: 'success',
        title: 'Password Changed Successfully',
        text: 'Please login with your new password',
        confirmButtonColor: '#00A3C4'
      });
      
      logout(); // Clear the current session
      navigate('/login');
    } catch (error) {
      setError('Failed to change password. Please check your current password and try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <input
              type="password"
              {...register('currentPassword', { 
                required: 'Current password is required'
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3C4]"
              placeholder="Current Password"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <input
              type="password"
              {...register('newPassword', { 
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3C4]"
              placeholder="New Password"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="mb-6">
            <input
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === newPassword || 'Passwords do not match'
              })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3C4]"
              placeholder="Confirm New Password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#00A3C4] text-white py-2 px-4 rounded-md hover:bg-[#008CAB] transition-colors"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;