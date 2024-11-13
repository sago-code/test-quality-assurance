import axios from 'axios';
import { Session } from '@qa-assessment/shared';

describe('Auth API', () => {
    let authToken: string;
    let userId: string;
    let username: string;
    let password: string;

    beforeAll(async () => {
        // Create a random username and password
        username = `testuser_${Math.random().toString(36).substring(7)}`;
        password = 'password123';

        // Register a test user
        const registerResponse = await axios.post<Session>('/users', {
        username,
        password,
        });

        expect(registerResponse.status).toBe(200);
        authToken = registerResponse.data.token;
        userId = registerResponse.data.userId;

        // Configure axios to use the auth token for subsequent requests
        axios.defaults.headers.common['Authorization'] = authToken;
    });

    afterAll(() => {
        // Clean up axios headers
        delete axios.defaults.headers.common['Authorization'];
    });

    describe('POST /login', () => {
        it('should login successfully with valid credentials', async () => {
        const loginResponse = await axios.post<Session>('/auth/login', {
            username,
            password,
        });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.data).toHaveProperty('token');
        expect(loginResponse.data).toHaveProperty('userId');
        });

        it('should reject login with invalid credentials', async () => {
        try {
            await axios.post('/auth/login', {
            username: 'invaliduser',
            password: 'wrongpassword',
            });
            fail('Should have thrown an error');
        } catch (error: any) {
            expect(error.response.status).toBe(422);
            expect(error.response.data.message).toBe('Invalid credentials');
        }
        });
    });

    describe('POST /logout', () => {
        it('should logout successfully with a valid token', async () => {
        const logoutResponse = await axios.post('/auth/logout');

        expect(logoutResponse.status).toBe(200);
        expect(logoutResponse.data.message).toBe('Logged out');
        });

        it('should reject logout without authentication', async () => {
        // Remove the auth token
        delete axios.defaults.headers.common['Authorization'];

        try {
            await axios.post('/auth/logout');
            fail('Should have thrown an error');
        } catch (error: any) {
            expect(error.response.status).toBe(401);
            expect(error.response.data.message).toBe('Unauthorized');
        }

        // Restore the auth token for future tests
        axios.defaults.headers.common['Authorization'] = authToken;
        });
    });
}); 
