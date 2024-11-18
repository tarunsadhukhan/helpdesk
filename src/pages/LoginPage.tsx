import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserSquare2, Ticket, FileText, Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [loginError, setLoginError] = useState('')



/*
  const onSubmit = (data: LoginForm) => {
    console.log(data);
    navigate('/submit-ticket');
  };
*/

  const onSubmit = async (data: LoginForm) => {
   //   console.log(data.username)
    try {
      setLoginError('');
      await login({ username: data.username, password: data.password });
      
     

      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');

      }
      
      navigate('/submit-ticket');
    } catch (error) {
      setLoginError('Invalid username or password');
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <UserSquare2 className="w-8 h-8 text-[#00A3C4] mb-2" />
          <span className="text-sm text-center">Register</span>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <Ticket className="w-8 h-8 text-[#00A3C4] mb-2" />
          <span className="text-sm text-center">Submit Ticket</span>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <FileText className="w-8 h-8 text-[#00A3C4] mb-2" />
          <span className="text-sm text-center">My Tickets</span>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <Lightbulb className="w-8 h-8 text-[#00A3C4] mb-2" />
          <span className="text-sm text-center">Knowledge Base</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Login to start your session</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto">
          <div className="mb-4">
            <input
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3C4]"
              placeholder="Username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3C4]"
              placeholder="Password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="rounded border-gray-300 text-[#00A3C4] focus:ring-[#00A3C4]"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00A3C4] text-white py-2 px-4 rounded-md hover:bg-[#008CAB] transition-colors"
          >
            LOGIN
          </button>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-[#00A3C4] hover:underline">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;