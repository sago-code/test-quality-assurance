import { render, waitFor } from '@testing-library/react';
import { useStorage } from '../hooks';
import { useNavigate } from 'react-router-dom';
import Root from './root';
import { describe, expect, it, vi } from 'vitest';
import { Mock } from '@vitest/spy';

vi.mock('../hooks', () => ({
  useStorage: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('Root Component', () => {
  const mockNavigate = vi.fn();
  const mockStorage = {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useNavigate as Mock).mockReturnValue(mockNavigate);
    (useStorage as Mock).mockReturnValue(mockStorage);
  });

  it('should redirect to /login when no session exists', () => {
    mockStorage.get.mockReturnValue(null);
    render(<Root />);

    expect(mockStorage.get).toHaveBeenCalledWith('session');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockNavigate).not.toHaveBeenCalledWith('/posts');
  });

  it('should redirect to /posts when session exists', () => {
    mockStorage.get.mockReturnValue(
      JSON.stringify({
        token: 'test-token',
        userId: '123',
      }),
    );

    render(<Root />);

    expect(mockStorage.get).toHaveBeenCalledWith('session');
    expect(mockNavigate).toHaveBeenCalledWith('/posts');
    expect(mockNavigate).not.toHaveBeenCalledWith('/login');
  });

  it('should check session only once on initial render', () => {
    mockStorage.get.mockReturnValue(null);
    render(<Root />);

    expect(mockStorage.get).toHaveBeenCalledTimes(1);
  });

  it('should display loading text while redirecting', () => {
    mockStorage.get.mockReturnValue(null);
    const { container } = render(<Root />);

    expect(container.textContent).toBe('Redirecting you...');
  });

  it('should handle malformed session data gracefully', () => {
    mockStorage.get.mockReturnValue('invalid-json');
    render(<Root />);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
  
  //Test created for me (Santiago Orjuela Vera)
  //persist session data after redirect to /posts
  it('should persist session data after redirect to /posts', () => {
      const sessionData = {
        token: 'test-token',
        userId: '123',
      };
      mockStorage.get.mockReturnValue(JSON.stringify(sessionData));

      render(<Root />);

      expect(mockStorage.get).toHaveBeenCalledWith('session');
      expect(mockStorage.set).not.toHaveBeenCalledWith('session', null);
      expect(mockNavigate).toHaveBeenCalledWith('/posts');
  });

  //not call get after redirecting to /login or /posts
  it('should not call get after redirecting to /login or /posts', () => {
    mockStorage.get.mockReturnValue(null);
  
    render(<Root />); 
  
    expect(mockStorage.get).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  //useStorage to get the session data
  it('should handle error in useStorage.get gracefully', () => {
    const originalConsoleError = console.error;
    const mockConsoleError = vi.fn();
    console.error = mockConsoleError;
  
    mockStorage.get.mockImplementation(() => {
      throw new Error('Storage error');
    });
  
    render(<Root />);
  
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('Storage error'),
      expect.any(Error)
    );
  
    console.error = originalConsoleError;
  });
  
  //useStorage to get the session data
  it('should use useStorage to get the session data', () => {
    mockStorage.get.mockReturnValue(
      JSON.stringify({
        token: 'test-token',
        userId: '123',
      }),
    );
  
    render(<Root />);
  
    expect(mockStorage.get).toHaveBeenCalledWith('session');
  });

  //redirect only after useEffect completes
  it('should redirect only after useEffect completes', async () => {
    mockStorage.get.mockReturnValue(
      JSON.stringify({
        token: 'test-token',
        userId: '123',
      }),
    );
  
    render(<Root />);
  
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/posts');
    });
  });

  //not change the redirecting message during the redirect
  it('should not change the redirecting message during the redirect', () => {
    mockStorage.get.mockReturnValue(null);
  
    const { container } = render(<Root />);
  
    expect(container.textContent).toBe('Redirecting you...');
  });

  //not attempt to set session data when no session exists
  it('should not attempt to set session data when no session exists', () => {
    mockStorage.get.mockReturnValue(null);
  
    render(<Root />);
  
    expect(mockStorage.set).not.toHaveBeenCalled();
  });

  //redirect to /login when session data is invalid JSON
  it('should redirect to /login when session data is invalid JSON', () => {
    mockStorage.get.mockReturnValue('invalid-json');
  
    render(<Root />);
  
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  //not re-execute useEffect if session data does not change
  it('should not re-execute useEffect if session data does not change', () => {
    mockStorage.get.mockReturnValue(
      JSON.stringify({
        token: 'test-token',
        userId: '123',
      }),
    );
  
    const { rerender } = render(<Root />);
  
    expect(mockNavigate).toHaveBeenCalledWith('/posts');
  
    rerender(<Root />);
  
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });  
});
