import { jwtDecode } from 'jwt-decode';  // Named import instead of default import

interface JwtPayload {
  sub: number;
  // Add other expected properties from your JWT payload
  [key: string]: any;
}

export function getCurrentUserId(): number | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<JwtPayload>(token); // Specify the type parameter
    console.log('Decoded token:', decoded); // Add this line
    return decoded.sub;
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('token');
}