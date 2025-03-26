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
    
    // Log raw response text before parsing
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    const data = JSON.parse(responseText);
    
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