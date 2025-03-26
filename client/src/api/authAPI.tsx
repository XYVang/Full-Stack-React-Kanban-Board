import { UserLogin } from "../interfaces/UserLogin";

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

    // Perform the fetch with extended error handling
    const response = await fetch('/auth/login', fetchOptions);

    // Log full response details
    console.log('Response Status:', response.status);
    console.log('Response Headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Check response content type
    const contentType = response.headers.get('content-type');
    console.log('Content Type:', contentType);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error Response Text:', errorText);
      console.groupEnd();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // Try parsing response
    try {
      const data = await response.json();
      console.log('Parsed Response Data:', JSON.stringify(data, null, 2));
      
      // Validate response structure
      if (!data.success) {
        console.error('Login failed:', data.message);
        throw new Error(data.message || 'Login failed');
      }

      console.groupEnd();
      return data;
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError);
      
      const fallbackText = await response.text();
      console.error('Fallback Response Text:', fallbackText);
      
      console.groupEnd();
      throw new Error('Failed to parse server response');
    }
  } catch (error) {
    console.error('Login Process Error:', error);
    throw error;
  }
};

export { login };