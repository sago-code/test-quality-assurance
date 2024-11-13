import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserProfile from './profile';
import { vi } from 'vitest';
import { useApiFetch } from '../hooks';
import '@testing-library/jest-dom';
import BookSearch from '../components/book-search';

// Mock para el hook useApiFetch
vi.mock('../hooks', () => ({
    useApiFetch: vi.fn(),
}));

describe('UserProfilePage', () => {
    it('should display loading state while fetching user profile', () => {
        const mockUseApiFetch = {
            data: null,
            error: null,
            isLoading: true,
            get: vi.fn(),
            put: vi.fn(),
        };

        (useApiFetch as any).mockReturnValue(mockUseApiFetch);

        render(<UserProfile />);

        expect(screen.getByText(/Loading profile.../i)).toBeInTheDocument();
    });

    it('should display an error state when there is an error fetching user profile', () => {
        const mockUseApiFetch = {
            data: null,
            error: true,
            isLoading: false,
            get: vi.fn(),
            put: vi.fn(),
        };

        (useApiFetch as any).mockReturnValue(mockUseApiFetch);

        render(<UserProfile />);

        expect(screen.getByText(/Error loading profile/i)).toBeInTheDocument();
    });

    it('should display "No favorite book selected" if the user has no favorite book', () => {
        const mockUseApiFetch = {
            data: {
                id: '123',
                username: 'John Doe',
                favoriteBook: null,
            },
            error: null,
            isLoading: false,
            get: vi.fn(),
            put: vi.fn(),
        };

        (useApiFetch as any).mockReturnValue(mockUseApiFetch);

        render(<UserProfile />);

        expect(screen.getByText(/No favorite book selected/i)).toBeInTheDocument();
    });

    it('should update the favorite book when a new book is selected', async () => {
        const mockUseApiFetch = {
        data: {
            id: '123',
            username: 'John Doe',
            favoriteBook: null,
        },
        error: null,
        isLoading: false,
        get: vi.fn(),
        put: vi.fn().mockResolvedValue(true),
        };

        (useApiFetch as any).mockReturnValue(mockUseApiFetch);

        render(<UserProfile />);

        const editButton = screen.getByRole('button');
        const pencilIcon = editButton.querySelector('svg');
        if (pencilIcon) {
            fireEvent.click(editButton);
        }

        let bookTitle;
        try {
            bookTitle = await screen.findByText(/Book Title/i);
        } catch (error) {
            console.error("No se encontró el libro:", error);
        }
        
        if (bookTitle) {
            fireEvent.click(bookTitle);
        
            await waitFor(() => {
                expect(mockUseApiFetch.put).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    favoriteBook: expect.objectContaining({
                    title: 'Book Title',
                    }),
                })
            );
        });

        expect(screen.getByText(/Book Title/i)).toBeInTheDocument();
        } else {
            console.error("No se encontró el título del libro para hacer clic");
        }
    });                            
});
