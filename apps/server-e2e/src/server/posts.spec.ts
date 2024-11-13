import axios from 'axios';
import { Post, Session } from '@qa-assessment/shared';

describe('Posts API', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Register a test user
    const username = `testuser_${Math.random().toString(36).substring(7)}`;
    const password = 'password123';

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

  describe('POST /posts', () => {
    it('should create a new post successfully', async () => {
      // Prepare test data
      const postData = {
        title: 'Test Post Title',
        content: 'This is a test post content.',
      };

      // Create post
      const createResponse = await axios.post<Post>('/posts', postData);

      // Verify response status
      expect(createResponse.status).toBe(201);

      // Verify response data
      const createdPost = createResponse.data;
      expect(createdPost).toMatchObject({
        title: postData.title,
        content: postData.content,
        authorId: userId,
      });

      // Verify post properties
      expect(createdPost.id).toBeDefined();
      expect(createdPost.createdAt).toBeDefined();
      expect(createdPost.updatedAt).toBeDefined();

      // Verify we can fetch the created post
      const getResponse = await axios.get<Post>(`/posts/${createdPost.id}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.data).toEqual(createdPost);
    });

    it('should reject post creation with invalid data', async () => {
      // Test with empty title
      const invalidPost = {
        title: '',
        content: 'Test content',
      };

      try {
        await axios.post('/posts', invalidPost);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(422);
        expect(error.response.data.errors).toBeDefined();
      }
    });

    it('should reject unauthorized post creation', async () => {
      // Remove auth token
      delete axios.defaults.headers.common['Authorization'];

      try {
        await axios.post('/posts', {
          title: 'Unauthorized Post',
          content: 'This should fail',
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }

      // Restore auth token for subsequent tests
      axios.defaults.headers.common['Authorization'] = authToken;
    });

    //test create for me (Santiago Orjuela Vera)
    //update a post successfully
    it('should update a post successfully', async () => {
      const postData = {
        title: 'Original Title',
        content: 'Original content.',
      };
      const createResponse = await axios.post<Post>('/posts', postData);
      const postId = createResponse.data.id;

      const updatedData = {
        title: 'Updated Title',
        content: 'Updated content.',
      };
      const updateResponse = await axios.put<Post>(`/posts/${postId}`, updatedData);

      expect(updateResponse.status).toBe(200);

      const updatedPost = updateResponse.data;
      expect(updatedPost).toMatchObject(updatedData);
    });

    //delete a post successfully
    it('should delete a post successfully', async () => {

      const postData = {
        title: 'Title to Delete',
        content: 'Content to delete.',
      };
      const createResponse = await axios.post<Post>('/posts', postData);
      const postId = createResponse.data.id;

      const deleteResponse = await axios.delete(`/posts/${postId}`);

      expect(deleteResponse.status).toBe(200);

      try {
        await axios.get<Post>(`/posts/${postId}`);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });

    //update a post with invalid data
    it('should not allow updating a post with invalid data', async () => {

      const postData = {
        title: 'Valid Title',
        content: 'Valid content.',
      };
      const createResponse = await axios.post<Post>('/posts', postData);
      const postId = createResponse.data.id;

      const invalidData = {
        title: '',
        content: 'Updated content.',
      };
      try {
        await axios.put(`/posts/${postId}`, invalidData);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(422);
      }
    });

    //delete a post without authorization
    it('should not allow deleting a post without authorization', async () => {
      const postData = {
        title: 'Title to Delete Unauthorized',
        content: 'Content to delete unauthorized.',
      };
      const createResponse = await axios.post<Post>('/posts', postData);
      const postId = createResponse.data.id;

      delete axios.defaults.headers.common['Authorization'];

      try {
        await axios.delete(`/posts/${postId}`);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }

      axios.defaults.headers.common['Authorization'] = authToken;
    });
  });
});
