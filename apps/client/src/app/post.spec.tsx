import { render, screen, waitFor } from '@testing-library/react';
import PostsPage from './posts';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { useApiFetch } from '../hooks';

describe('PostsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock del hook `useApiFetch`
        vi.mock('../hooks/use-api-fetch', () => ({
            useApiFetch: vi.fn().mockImplementation(() => ({
                get: vi.fn(),
                post: vi.fn(),
                put: vi.fn(),
                delete: vi.fn(),
                data: null,
                error: null,
                isLoading: true,
                fetch: vi.fn(),
            })),
        }));
    });

    // Prueba para verificar que muestra el estado de carga
    it('should display loading state when data is being fetched', async () => {
        render(
            <MemoryRouter>
                <PostsPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/Loading posts.../i)).toBeInTheDocument();
    });

    it('should display error message when there is an error fetching posts', async () => {
        // Simulamos un error al obtener publicaciones
        vi.mocked(useApiFetch).mockReturnValue({
            data: null,
            isLoading: false,
            error: new Error('Failed to fetch posts'),
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            fetch: vi.fn(),
        });

        render(
            <MemoryRouter>
                <PostsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch posts/i)).toBeInTheDocument();
        });
    });
});
