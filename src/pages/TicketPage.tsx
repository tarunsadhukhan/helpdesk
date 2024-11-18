import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getPriorities, getProblems, getAssets, getDepartments, getLocations, getSubAssets, fetchTickets } from '../services/api';
import { Priority, TicketFormData, Problem, Asset, Department, Location, SubAsset } from '../types';
import Swal from 'sweetalert2';  
import { submitTicket } from '../services/api';
import { Loader } from 'lucide-react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AssetSelect from '../components/AssetSelect';

interface TicketForm {
  subject: string;
  priority: string;
  message: string;
  asset: string;
  subasset: string;
  location: string;
  department: string;
  problem: string;
}

interface TicketStats {
  open: number;
  closed: number;
}

const TicketPage = () => {
  const { 
    control,
     
  } = useForm<TicketForm>({
    defaultValues: {
      subject: '',
      priority: '',
      message: '',
      asset: '',
      subasset: '',
      location: '',
      department: '',
      problem: ''
    }
  });

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<TicketForm>();
  const userloginId = localStorage.getItem('userloginid');
  const userName = localStorage.getItem('userloginname');
  const useremailId = localStorage.getItem('useremailid');
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [subassets, setSubAssets] = useState<SubAsset[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [ticketStats, setTicketStats] = useState<TicketStats>({ open: 0, closed: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const selectedLocation = watch('location');
  const selectedDepartment = watch('department');
  const selectedAsset = watch('asset');

  useEffect(() => {
    const loadTicketStats = async () => {
      try {
        setStatsLoading(true);
        const response = await fetchTickets();
        if (response?.stats) {
          setTicketStats({
            open: response.stats.open || 0,
            closed: response.stats.closed || 0
          });
        }
      } catch (error) {
        console.error('Error loading ticket stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadTicketStats();
  }, []);

  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        setIsLoading(true);
        const data = await getPriorities();
        setPriorities(data);
      } catch (err) {
        setError('Failed to load priorities. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProblems = async () => {
      try {
        setIsLoading(true);
        const datab = await getProblems();
        setProblems(datab);
      } catch (err) {
        setError('Failed to load problems. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const datab = await getLocations();
        setLocations(datab);
      } catch (err) {
        setError('Failed to load locations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriorities();
    fetchProblems();
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!selectedLocation) {
        setDepartments([]);
        return;
      }

      try {
        setIsLoading(true);
        const departmentsData = await getDepartments(selectedLocation);
        setDepartments(departmentsData);
      } catch (err) {
        setError('Failed to load departments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [selectedLocation]);

  useEffect(() => {
    const fetchAssets = async () => {
      if (!selectedLocation) {
        setAssets([]);
        return;
      }

      try {
        setIsLoading(true);
        const assetData = await getAssets(selectedLocation);
        setAssets(assetData);
      } catch (err) {
        setError('Failed to load assets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [selectedLocation]);

  useEffect(() => {
    const fetchSubAssets = async () => {
      if (!selectedAsset) {
        setSubAssets([]);
        return;
      }

      try {
        setIsLoading(true);
        const subassetData = await getSubAssets(selectedAsset);
        setSubAssets(subassetData);
      } catch (err) {
        setError('Failed to load sub-assets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubAssets();
  }, [selectedAsset]);

  const onSubmit = async (data: TicketForm) => {
    try {
      await submitTicket(data);
      
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your ticket has been submitted successfully.',
        confirmButtonColor: '#00A3C4',
      });
      
      // Refresh ticket stats after submission
      const response = await fetchTickets();
      if (response?.stats) {
        setTicketStats({
          open: response.stats.open || 0,
          closed: response.stats.closed || 0
        });
      }
      
      reset(); // Reset form after successful submission
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to submit ticket. Please try again.',
        confirmButtonColor: '#00A3C4',
      });
    }
  };

  const handleReset = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will clear all form fields!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00A3C4',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        reset();
        Swal.fire({
          title: 'Cleared!',
          text: 'The form has been reset.',
          icon: 'success',
          confirmButtonColor: '#00A3C4',
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Submit Ticket</h2>
          
          <div className="mb-6">
            <select
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3C4]"
            >
              <option>Default Ticket Form</option>
            </select>
          </div>

          <div className="bg-gray-50 p-6 rounded-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Ticket Properties</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requester <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={`${userName}@${useremailId}`}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('subject', { 
                    required: 'Subject is required',
                    minLength: {
                      value: 5,
                      message: 'Subject must be at least 5 characters'
                    }
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3C4]"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                {isLoading ? (
                  <div className="w-full px-3 py-2 border rounded-md bg-gray-50">
                    <Loader className="w-4 h-4 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="text-red-600 text-sm">{error}</div>
                ) : (
                  <select
                    {...register('location', { required: 'Location is required' })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3C4]"
                  >
                    <option value="">Select Location</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                )}
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('department', { required: 'Department is required' })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3C4]"
                  disabled={!selectedLocation}
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                )}
              </div>

           
 
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset
                </label>
                <AssetSelect
                  control={control}
                  assets={assets}
                  disabled={!selectedDepartment}
                  error={errors.asset?.message}
                />
              </div>


              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Asset
                </label>
                <select
                  {...register('subasset')}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3C4]"
                  disabled={!selectedAsset}
                >
                  <option value="">Select Sub Asset</option>
                  {subassets.map((subasset) => (
                    <option key={subasset.id} value={subasset.id}>
                      {subasset.codename}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Problem Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('problem', { required: 'Problem type is required' })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3C4]"
                >
                  <option value="">Select Problem Type</option>
                  {problems.map((problem) => (
                    <option key={problem.id} value={problem.id}>
                      {problem.name}
                    </option>
                  ))}
                </select>
                {errors.problem && (
                  <p className="mt-1 text-sm text-red-600">{errors.problem.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('priority', { required: 'Priority is required' })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3C4]"
                >
                  <option value="">Select Priority</option>
                  {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('message', { 
                    required: 'Message is required',
                    maxLength: {
                      value: 500,
                      message: 'Message cannot exceed 500 characters'
                    }
                  })}
                  rows={6}
                  maxLength={500}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3C4]"
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-[#00A3C4] text-white py-2 px-6 rounded-md hover:bg-[#008CAB] transition-colors"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Ticket Summary</h3>
          {statsLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader className="w-6 h-6 animate-spin text-[#00A3C4]" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Open tickets</span>
                <span className="bg-[#00A3C4] text-white px-2 py-0.5 rounded-full text-sm">
                  {ticketStats.open}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Closed tickets</span>
                <span className="bg-[#00A3C4] text-white px-2 py-0.5 rounded-full text-sm">
                  {ticketStats.closed}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketPage;