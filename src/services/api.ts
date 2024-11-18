import axios from 'axios';
import { LoginCredentials,LoginResponse,Priority,Problem,Location,Department,Asset,
  SubAsset, TicketData ,TicketDetail,TicketReply,TicketFormData } from '../types';

  import * as CryptoJS from "crypto-js";

const API_BASE_URL=process.env.REACT_APP_BASE_API_URL
//console.log(API_BASE_URL)
//const API_BASE_URL = 'http://localhost:5001'; // Replace with your actual API URL
//const API_BASE_URL = 'http://13.126.47.172:5002'; // Replace with your actual API URL

/*
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJpYXQiOjE3MDk4NjQ3MjAsImV4cCI6MTcwOTk1MTEyMH0.abcdefghijklmnopqrstuvwxyz",
  "user": {
    "id": "123456",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
*/



export const loginUser = async (credentials: LoginCredentials) => {
 console.log('ahahhaha')  
 const secretKey = "my-secret-key"; // Use a strong secret key
 const password=credentials.password
    const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
    const username = credentials.username
    console.log(encryptedPassword)
    
 
    const cred = {
      username: username,
      password: password,
    };
  try {
    const response = await fetch(`${API_BASE_URL}/api/authRoutes/userlogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    console.log('fetch datas',data)
    console.log(data.response.user.email);

    localStorage.setItem('userloginid', data.response.user.id);
    localStorage.setItem('userloginname', data.response.user.username);
    localStorage.setItem('useremailid', data.response.user.email);
    localStorage.setItem('usetype', data.response.user.type_of_user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.response.user));
    const userData1 = localStorage.getItem('user');
    console.log('log user',userData1,'per',data.response.user.type_of_user)
    
    if (data.response?.user?.type_of_user) {
      const dbdata = { permissions: JSON.stringify(data.response.user.type_of_user) };
      console.log('dbdata', dbdata);
    
      const parsedPermissions = JSON.parse(dbdata.permissions);
      console.log('permission', parsedPermissions);
      console.log(parsedPermissions.superuser);


      const parsedData = JSON.parse(parsedPermissions);
      console.log('Superuser:', parsedData.superuser); // Output: 1
      localStorage.setItem('usetype', parsedData.superuser);

    } else {
      console.error('type_of_user is undefined');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

/*
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/authRoutes/loginhelp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    
    // Validate the response structure
    if (!data.token || !data.user || !data.user.id || !data.user.username || typeof data.user.role !== 'number') {
      throw new Error('Invalid response format');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
*/

export const changePassword = async (passwords: { currentPassword: string; newPassword: string }) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwords),
    });

    if (!response.ok) {
      throw new Error('Failed to change password');
    }

    return await response.json();
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};




export const getBrandName = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/masterRoutes/brand-name`);
    if (!response.ok) {
      throw new Error('Failed to fetch brand name');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};


export const getPriorities = async (): Promise<Priority[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/masterRoutes/combobox-priority`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch priorities');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching priorities:', error);
    throw error;
  }
};





export const getProblems = async (): Promise<Problem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/masterRoutes/combobox-problem`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch problems');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching problems:', error);
    throw error;
  }
};


 


export const getLocations = async (): Promise<Location[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/masterRoutes/combobox-location`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch problems');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching problems:', error);
    throw error;
  }
};


//export const getDepartmens = async (): Promise<Department[]> => {
  export const getDepartments = async (locationId: string): Promise<Department[]> => {

  try {
//    const response = await fetch(`${API_BASE_URL}/api/masterRoutes/combobox-departments`);
    const response = await fetch(`${API_BASE_URL}/api/masterRoutes/combobox-departments?locationId=${locationId}`);
    
    
    if (!response.ok) {
      throw new Error('Failed to fetch problems');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching problems:', error);
    throw error;
  }
};



  export const getAssets = async (locationId: string): Promise<Asset[]> => {

    try {
      const response = await fetch(`${API_BASE_URL}/api/masterRoutes/combobox-asset?locationId=${locationId}`);
      
      
      if (!response.ok) {
        throw new Error('Failed to fetch problems');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching problems:', error);
      throw error;
    }
  };


  export const getSubAssets = async (assetId: string): Promise<SubAsset[]> => {

    try {
      const response = await fetch(`${API_BASE_URL}/api/masterRoutes/combobox-subasset?assetId=${assetId}`);
      
      
      if (!response.ok) {
        throw new Error('Failed to fetch problems');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching problems:', error);
      throw error;
    }
  };


  


  export const generateTicketId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `TKT-${timestamp}-${random}`;
  };
  
  export const submitTicket = async (formData: Partial<TicketData>) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('userloginid') || '{}');
    const companyid=JSON.parse(localStorage.getItem('companyid') || '{}');
    const compprefix=(localStorage.getItem('compprefix') || '{}');
    const clientLocalTimestamp = new Date().toLocaleString('en-GB', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, hour12: false });

    // Get the client's timezone
    const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const clientTimestamp = new Date().toISOString();

    console.log('Client Local Timestamp:', clientLocalTimestamp); // e.g., "02/11/2024, 15:30:00"
    console.log('Client Timezone:', clientTimezone); // e.g., "America/New_York"

    const ticketData: TicketData = {
      ...formData,
      userId: user,
      requesterEmail: user.email,
      timestamp: new Date().toISOString(),
      ticketId: generateTicketId(),
      status: 'open',
      companyid: companyid,
      compprefix: compprefix,

      //      department: 'support',
    } as TicketData;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/servdeskRoutes/ticketdatasave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(ticketData),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit ticket');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Ticket submission error:', error);
      throw error;
    }
  };

/*
  export const fetchTickets = async (status?: string) => {
    const token = localStorage.getItem('token');
    const requestData = status ? { status } : {}; 

    try {
      const url = status 
        ? `${API_BASE_URL}/api/servdeskRoutes/ticketrecords?status=${status}`
        : `${API_BASE_URL}/api/servdeskRoutes/ticketrecords`;
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  };
*/

  export const fetchTickets = async (status?: string) => {
    const token = localStorage.getItem('token');
    
    // Create the request payload. If 'status' is provided, it will be included.
    const requestData = status ? { status } : {};
  
    try {
      const url = `${API_BASE_URL}/api/servdeskRoutes/ticketrecords`;  // No query parameters
      
      const response = await fetch(url, {
        method: 'POST',  // Use POST request
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',  // Set content type to JSON
        },
        body: JSON.stringify(requestData),  // Send status in request body
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
  
      return await response.json();  // Return the response as JSON
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  };
  
/*
  export const fetchTicketDetails = async (ticketId: string) => {
    // In production, replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: ticketId,
          subject: 'Sddf',
          status: 'Open',
          priority: 'High',
          helpTopic: 'Support query',
          department: 'Support',
          createdDate: 'October 22, 2024 10:48 am',
          lastResponse: 'October 22, 2024 10:49 am',
          lastMessage: 'Demo Admin',
          replies: [
            {
              id: '1',
              author: 'Demo Admin',
              message: 'Hhhh',
              timestamp: 'October 22, 2024 10:48 am',
              attachments: [
                {
                  id: '1',
                  name: 'screenshot.jpg',
                  url: '/uploads/screenshot.jpg',
                  size: '250KB'
                }
              ]
            }
          ]
        });
      }, 1000);
    });
  };
  */

  
   



  export const fetchTicketDetails = async (ticketId: string) => {
    const requestData = ticketId ? { ticketId } : {};
    const token = localStorage.getItem('token');
    
    try {
      const url = `${API_BASE_URL}/api/servdeskRoutes/ticketdetailrecords`;  // POST request URL
  
      // Make POST request with fetch
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // Include Bearer token
          'Content-Type': 'application/json',  // Set Content-Type as JSON
        },
        body: JSON.stringify(requestData),  // Send request data in the body
      });
  
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`Error fetching ticket details: ${response.statusText}`);
      }
  
      const data = await response.json();  // Parse JSON response
      return data;
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      throw error;
    }
  };
  
  
  export const updateTicketStatus = async (ticketId: string, status: string) => {
    const token = localStorage.getItem('token');
    
    // Create the request payload. If 'status' is provided, it will be included.
    const requestData = status ? { status } : {};

    try {
      const url = `${API_BASE_URL}/api/servdeskRoutes/ticketrecords`;  // POST request URL
  
      // Make POST request with fetch
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // Include Bearer token
          'Content-Type': 'application/json',  // Set Content-Type as JSON
        },
        body: JSON.stringify(requestData),  // Send request data in the body
      });
  
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`Error fetching ticket details: ${response.statusText}`);
      }
  
      const data = await response.json();  // Parse JSON response
      return data;
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      throw error;
    }
  };
  
   


  export const submitTicketReply = async (ticketId: string, data: FormData) => {
    const token = localStorage.getItem('token');
    
    // Create the request payload. If 'status' is provided, it will be included.
    const requestData = ticketId ? { ticketId } : {};

    try {
      const url = `${API_BASE_URL}/api/servdeskRoutes/ticketrecords`;  // POST request URL
  
      // Make POST request with fetch
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // Include Bearer token
          'Content-Type': 'application/json',  // Set Content-Type as JSON
        },
        body: JSON.stringify(requestData),  // Send request data in the body
      });
  
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`Error fetching ticket details: ${response.statusText}`);
      }
  
      const data = await response.json();  // Parse JSON response
      return data;
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      throw error;
    }
  };


  export const submitTicketReplys = async (
    ticketId: string, 
    formData: FormData, 
    status: string // Added the third parameter
) => {
    // Append the additional data to the FormData
    formData.append('ticketId', ticketId);
    formData.append('status', status);
    const user = JSON.parse(localStorage.getItem('userloginid') || '{}');
    formData.append('userId', user);
    
    console.log('FormData contents:', Array.from(formData.entries())); // For debugging

    // Make the POST request with the formData
    const response = await fetch('http://localhost:5001/api/servdeskRoutes/submitReply', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to submit reply');
    }

    return await response.json();
};

