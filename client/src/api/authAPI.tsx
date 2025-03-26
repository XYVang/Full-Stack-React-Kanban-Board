import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
  try {
    console.log('Attempting login with:', userInfo);

    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    console.log('Response status:', response.status);
    
    // Improved error handling for different response scenarios
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(errorText || 'Login failed');
    }

    // Log raw response text before parsing
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    // Try parsing the text as JSON
    const data = JSON.parse(responseText);
    
    // Check for success
    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Detailed login error:', error);
    throw error;
  }
};

export { login };