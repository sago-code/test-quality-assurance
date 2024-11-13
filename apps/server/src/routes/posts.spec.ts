import request from 'supertest';
import { makeExpressApp } from '../lib';
import { sessionRepository, userRepository } from '../database';
import { Session, User } from '@qa-assessment/shared';
import bcrypt from 'bcrypt';

describe('Posts Routes', () => {
  let mockUser: User;
  let mockSession: Session;
  const currentDate = new Date();
  let token: string;
  let id: Number;

  beforeEach(() => {
    // Mock user data
    mockUser = {
      id: '1',
      username: 'testuser',
      password: bcrypt.hashSync('password123', 10),
    };

    mockSession = {
      id: '1',
      userId: mockUser.id,
      token: 'test-session-token',
      createdAt: currentDate,
    };

    // Mock repository methods
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
        token === mockSession.token ? mockSession : null,
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
  });

  it('should create a post successfully', async () => {
    const newPost = { title: 'New Post', content: 'This is a test post' };
    const response = await request(app)
      .post('/posts')
      .set('authorization', `${token}`)
      .send(newPost);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toMatchObject(newPost);
    id = response.body.id;
  });

  it('should require both title and content in the create post', async () => {
    const newPostMissingContent = { 
      title: 'New Post'
      // missing content
    };
  
    const newPostMissingTitle = {
      content: 'This is a post'
      // missing title
    };
    const newPostMissingAll = {};
  
    const responseMissingContent = await request(app)
      .post('/posts')
      .set('authorization', `${token}`)
      .send(newPostMissingContent);
  
    expect(responseMissingContent.status).toBe(422);
    expect(responseMissingContent.body).toHaveProperty('errors');
    expect(responseMissingContent.body.errors[0]).toMatchObject({
      code: 'invalid_type',
      message: 'Required',
      path: ['content']
    });
  
    const responseMissingTitle = await request(app)
      .post('/posts')
      .set('authorization', `${token}`)
      .send(newPostMissingTitle);
  
    expect(responseMissingTitle.status).toBe(422);
    expect(responseMissingTitle.body).toHaveProperty('errors');
    expect(responseMissingTitle.body.errors[0]).toMatchObject({
      code: 'invalid_type',
      message: 'Required',
      path: ['title']
    });

    const responseMissingAll = await request(app)
      .post('/posts')
      .set('authorization', `${token}`)
      .send(newPostMissingAll);
  
    expect(responseMissingAll.status).toBe(422);
    expect(responseMissingAll.body).toHaveProperty('errors');
    expect(responseMissingAll.body.errors[0]).toMatchObject({
      code: 'invalid_type',
      message: 'Required',
      path: ['title']
    });
  });

  it('should get a one post successfully', async () => {
    const response = await request(app)
      .get(`/posts/${id}`)
      .set('authorization', `${token}`);
  
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: id,
      authorId: expect.any(Number),
      title: expect.any(String),
      content: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should get all posts successfully', async () => {
    const response = await request(app)
      .get('/posts')
      .set('authorization', `${token}`);
  
    expect(response.status).toBe(200);
  
    expect(Array.isArray(response.body)).toBe(true);
  
    response.body.forEach((post: any) => {
      expect(post).toMatchObject({
        id: id,
        authorId: expect.any(Number),
        title: expect.any(String),
        content: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
  
  it('should update a post successfully', async () => {
    const updatePost = { title: 'New Post', content: 'This is a test post' };
    const response = await request(app)
      .put(`/posts/${id}`)
      .set('authorization', `${token}`)
      .send(updatePost);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: id,
        authorId: expect.any(Number),
        title: expect.any(String),
        content: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
  });

  it('Should require both title and content when updating post', async () => {
    const newPostMissingContent = { 
      title: 'Update Post',
      content: '' // Contenido vacío
    };
  
    const newPostMissingTitle = {
      title: '', // Título vacío
      content: 'This is a update'
    };
  
    const responseMissingContent = await request(app)
      .put(`/posts/${id}`)
      .set('authorization', `${token}`)
      .send(newPostMissingContent);
  
    expect(responseMissingContent.status).toBe(422);
    expect(responseMissingContent.body).toHaveProperty('errors');
    expect(responseMissingContent.body.errors[0]).toMatchObject({
      code: 'too_small',
      message: 'Content is required',
      path: ['content']
    });
  
    const responseMissingTitle = await request(app)
      .put(`/posts/${id}`)
      .set('authorization', `${token}`)
      .send(newPostMissingTitle);
  
    expect(responseMissingTitle.status).toBe(422);
    expect(responseMissingTitle.body).toHaveProperty('errors');
    expect(responseMissingTitle.body.errors[0]).toMatchObject({
      code: 'too_small',
      message: 'Title is required',
      path: ['title']
    });
  });
  
  it('Should be erase the selected post successfully', async () => {
    const response = await request(app)
    .delete(`/posts/${id}`)
    .set('authorization', `${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Post deleted' });
  })
});
