import { JwtPayload, jwtDecode } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  username: string;
  exp: number;
}

class AuthService {
  getProfile() {
    // Decoded Token
    const token = this.getToken();
    return token ? jwtDecode<CustomJwtPayload>(token) : null;
  }

  loggedIn() {
    // Check if the user is logged in
    const token = this.getToken();
    return token && !this.isTokenExpired(token) ? true : false;
  }
  
  isTokenExpired(token: string) {
    try {
      // Decode the token for expiration time
      const decoded = jwtDecode<CustomJwtPayload>(token);
      
      // Convert
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return true;
    }
  }

  getToken(): string {
    // Token from localStorage
    return localStorage.getItem('id_token') || '';
  }

  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
    
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('id_token');
    
    window.location.assign('/login');
  }
}

export default new AuthService();