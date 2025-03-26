import { UserLogin } from "../interfaces/UserLogin";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://full-stack-react-kanban-board-lsk2.onrender.com";

const login = async (userInfo: UserLogin) => {
  try {
    console.group('Login Attempt');
    console.log('User Info:', JSON.stringify(userInfo, null, 2));
    
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Request': 'true'
      },
      body: JSON.stringify(userInfo)
    };

    console.log('Fetch Options:', JSON.stringify(fetchOptions, null, 2));

    // Use full API URL
    const response = await fetch(`${API_BASE_URL}/auth/login`, fetchOptions);

    console.log('Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error Response Text:', errorText);
      console.groupEnd();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Parsed Response Data:', JSON.stringify(data, null, 2));

    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }

    console.groupEnd();
    return data;
  } catch (error) {
    console.error('Login Process Error:', error);
    throw error;
  }
};

export { login };