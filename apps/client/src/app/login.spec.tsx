import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';  
import Login from './Login';
import { describe, expect, it, vi } from 'vitest';

describe('Login Component', () => {
    const mockNavigate = vi.fn();
    const mockStorage = {
        get: vi.fn(),
        set: vi.fn(),
        remove: vi.fn(),
    };

    const mockFetch = vi.fn();
    const mockUseFetch = {
        fetch: mockFetch,
        isLoading: false,
        error: null as Error | null,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        
        vi.stubGlobal('useNavigate', mockNavigate);
        vi.stubGlobal('useStorage', () => mockStorage);
        vi.stubGlobal('useFetch', () => mockUseFetch);
    });

    it('should render login form with username and password fields', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
    
        expect(screen.getByPlaceholderText('Username')).not.toBeNull();
        expect(screen.getByPlaceholderText('Password')).not.toBeNull();
        
        expect(screen.getByRole('button', { name: 'Sign in' })).not.toBeNull();
    });
    
    it('should submit form with valid username and password', async () => {
        render(
            <MemoryRouter>
            <Login />
            </MemoryRouter>
        );

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Sign in' });

        await userEvent.type(usernameInput, 'testuser');
        await userEvent.type(passwordInput, 'password123');

        await userEvent.click(submitButton);

        expect(submitButton).toBeDisabled();
    });

    it('should allow typing in the username field', async () => {
        render(
            <MemoryRouter>
            <Login />
            </MemoryRouter>
        );
        
        const usernameInput = screen.getByPlaceholderText('Username');
        await userEvent.type(usernameInput, 'testuser');
        
        expect(usernameInput).toHaveValue('testuser');
    });
    
    it('should allow typing in the password field', async () => {
        render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
        );
    
        const passwordInput = screen.getByPlaceholderText('Password');
        await userEvent.type(passwordInput, 'password123');
    
        expect(passwordInput).toHaveValue('password123');
    }); 
});
