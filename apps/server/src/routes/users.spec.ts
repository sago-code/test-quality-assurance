import request from 'supertest';
import { makeExpressApp } from '../lib';
import { sessionRepository, userRepository } from '../database';
import { Session, User } from '@qa-assessment/shared';
import bcrypt from 'bcrypt';

describe('User routes', () => {
    let mockUser: User;
    let mockSession: Session;
    const currentDate = new Date();
    let token: string;
    let id: number;

    beforeEach(() => {
        mockUser = {
            id: '1',
            username: 'testuser',
            password: bcrypt.hashSync('password123', 10),
        };

        mockSession = {
            id: '1',
            userId: String(mockUser.id),
            token: 'test-session-token',
            createdAt: currentDate,
        };

        jest
            .spyOn(userRepository, 'findByCredentials')
            .mockImplementation(async ({ username, password }) => {
                if (
                    username === mockUser.username &&
                    bcrypt.compareSync(password, mockUser.password)
                ) {
                    return mockUser;
                }
                return null;
            });

        jest.spyOn(sessionRepository, 'create').mockResolvedValue(mockSession);
        jest
            .spyOn(sessionRepository, 'findByToken')
            .mockImplementation(async (token) =>
                token === mockSession.token ? mockSession : null
            );
        jest.spyOn(sessionRepository, 'delete').mockResolvedValue(undefined);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const app = makeExpressApp();

    beforeEach(async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'testuser', password: 'password123' });

        expect(response.status).toBe(200);
        token = response.body.token;
        id = response.body.id;
    });

    it('It should return the user who logged in', async () => {
        const response = await request(app)
            .get(`/users/${id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            username: 'testuser',
            password: expect.stringMatching(/^\$2[ayb]\$.{56}$/)
        });
    });

    it('should create a new user successfully', async () => {
        const uniqueNumber = Date.now();
        const newUser = { username: `testUser${uniqueNumber}`, password: "testPassword2" };
        
        const response = await request(app)
            .post('/users')
            .send(newUser)
        ;
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: expect.any(String),
            userId: expect.any(String),
            token: expect.any(String),
            createdAt: expect.any(String)
        });
    
        expect(response.body.token).toMatch(/^[a-zA-Z0-9-]{16,32}$/);
        expect(new Date(response.body.createdAt).toISOString()).toBe(response.body.createdAt);
    });       

    it('should require both username and password in the create user', async () => {
        const uniqueNumber = Date.now();
        const userMissingPassword = {
            username: `testUser${uniqueNumber}`
            //missing password 
        };

        const userMissingUserName = {
            //missing username 
            password: 'testPassword'
        };

        const responseMissingPassword = await request(app)
            .post('/users')
            .send(userMissingPassword)
        ;

        expect(responseMissingPassword.status).toBe(422);
        expect(responseMissingPassword.body).toHaveProperty('errors');
        expect(responseMissingPassword.body.errors[0]).toMatchObject({
        code: 'invalid_type',
        message: "Required",
        path: ['password']
        });

        const responseMissingUserName = await request(app)
            .post('/users')
            .send(userMissingUserName)
        ;

        expect(responseMissingUserName.status).toBe(422);
        expect(responseMissingUserName.body).toHaveProperty('errors');
        expect(responseMissingUserName.body.errors[0]).toMatchObject({
        code: 'invalid_type',
        message: "Required",
        path: ['username']
        });
    });

    it('should return validation errors if username or password do not meet minimum length requirements', async () => {
        const uniqueNumber = Date.now();
        const userMissingPassword = {
            username: `testUser${uniqueNumber}`,
            password: ''
        };

        const userMissingUserName = {
            username: '', 
            password: 'testPassword'
        };

        const responseMissingPassword = await request(app)
            .post('/users')
            .send(userMissingPassword)
        ;

        expect(responseMissingPassword.status).toBe(422);
        expect(responseMissingPassword.body).toHaveProperty('errors');
        expect(responseMissingPassword.body.errors[0]).toMatchObject({
        code: 'too_small',
        message: "String must contain at least 8 character(s)",
        path: ['password']
        });

        const responseMissingUserName = await request(app)
            .post('/users')
            .send(userMissingUserName)
        ;

        expect(responseMissingUserName.status).toBe(422);
        expect(responseMissingUserName.body).toHaveProperty('errors');
        expect(responseMissingUserName.body.errors[0]).toMatchObject({
        code: 'too_small',
        message: "String must contain at least 3 character(s)",
        path: ['username']
        });
    });

    it('should update the username of the logged-in user successfully', async () => { 
        const uniqueNumber = Date.now();
        const updateUserName = { username: `testUser${uniqueNumber}` };
    
        const response = await request(app)
            .put(`/users/${id}`)
            .send(updateUserName)
        ;
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: expect.any(Number),
            username: updateUserName.username,
            password: expect.stringMatching(/^\$2[ayb]\$.{56}$/),
            favoriteBook: response.body.favoriteBook === null ? null : expect.anything()
        });
    
        if (response.body.favoriteBook !== null) {
            expect(typeof response.body.favoriteBook).toBe("string");
        }
    });
    
    it('should select and update the favorite book of the logged-in user', async () => {
        const updateFavoriteBook = {
            favoriteBook: {
                key: "/works/OL31577960W",
                title: "Chupa-chup!",
                author_name: ["Aleksandr Mikhaĭlovich Laptev"],
                first_publish_year: 2013
            }
        };
    
        const response = await request(app)
            .put(`/users/${id}`)
            .send(updateFavoriteBook);
    
        expect(response.status).toBe(200);
    
        const favoriteBookResponse = typeof response.body.favoriteBook === 'string'
            ? JSON.parse(response.body.favoriteBook)
            : response.body.favoriteBook;
    
        expect({
            ...response.body,
            favoriteBook: favoriteBookResponse
        }).toEqual({
            id: expect.any(Number),
            username: expect.any(String),
            password: expect.stringMatching(/^\$2[ayb]\$.{56}$/),
            favoriteBook: {
                key: "/works/OL31577960W",
                title: "Chupa-chup!",
                author_name: ["Aleksandr Mikhaĭlovich Laptev"],
                first_publish_year: 2013
            }
        });
    });         
});
