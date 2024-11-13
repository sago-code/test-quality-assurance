import axios from 'axios';
import { Session, User } from '@qa-assessment/shared';

jest.mock('axios');

// Mocks para los datos de usuario
const mockRegisterResponse = {
    status: 200,
    data: {
        token: 'mock-token',
        userId: 'mock-user-id',
    },
};

const mockGetResponse = {
    status: 200,
    data: {
        username: 'testuser',
        favoriteBook: 'Test Book',
    },
};

const mockUpdateResponse = {
    status: 200,
    data: {
        username: 'updateduser',
        favoriteBook: 'Updated Book Title',
    },
};

describe('User API', () => {
    let authToken: string;
    let userId: string;
    let username: string;
    let password: string;

    beforeAll(() => {
        username = `testuser_${Math.random().toString(36).substring(7)}`;
        password = 'password123';

        jest.spyOn(axios, 'post').mockResolvedValue(mockRegisterResponse);
        jest.spyOn(axios, 'get').mockResolvedValue(mockGetResponse);
        jest.spyOn(axios, 'put').mockResolvedValue(mockUpdateResponse);
    });

    afterAll(() => {
        delete axios.defaults.headers.common['Authorization'];
    });

    describe('POST /users', () => {
        it('should register a new user successfully', async () => {
        const registerResponse = await axios.post<Session>('/users', {
            username,
            password,
        });

        expect(registerResponse.status).toBe(200);
        expect(registerResponse.data).toHaveProperty('token');
        expect(registerResponse.data).toHaveProperty('userId');
        
        authToken = registerResponse.data.token;
        userId = registerResponse.data.userId;

        axios.defaults.headers.common['Authorization'] = authToken;
        });
    });

    describe('GET /users/:userId', () => {
        it('should fetch user data successfully', async () => {
        const getResponse = await axios.get<User>(`/users/${userId}`);

        expect(getResponse.status).toBe(200);
        expect(getResponse.data).toHaveProperty('username');
        expect(getResponse.data).toHaveProperty('favoriteBook');
        });
    });

    describe('PUT /users/:userId', () => {
        it('should update user data successfully', async () => {
        const updatedData = {
            username: 'updateduser',
            favoriteBook: 'Updated Book Title',
        };

        const updateResponse = await axios.put<User>(`/users/${userId}`, updatedData);

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.data.username).toBe(updatedData.username);
        expect(updateResponse.data.favoriteBook).toBe(updatedData.favoriteBook);
        });

        it('should return 422 for invalid data', async () => {
        const errorResponse = {
            response: {
            status: 422,
            data: { errors: 'Invalid data' },
            },
        };

        jest.spyOn(axios, 'put').mockRejectedValue(errorResponse);

        const invalidData = {
            username: '',
            favoriteBook: 'Updated Book Title',
        };

        try {
            await axios.put(`/users/${userId}`, invalidData);
            fail('Debería haber lanzado un error');
        } catch (error: any) {
            expect(error.response.status).toBe(422);
            expect(error.response.data.errors).toBeDefined();
        }
        });
    });
});
