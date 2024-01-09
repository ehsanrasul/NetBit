import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

jest.mock('../components/common/HeroSlide', () => () => <div data-testid="hero-slide" />);
jest.mock('../components/Media/MediaSlide', () => () => <div data-testid="media-slide" />);
jest.mock('../api/configs/tmdb.configs', () => ({
  mediaType: {
    movie: 'movie',
    tv: 'tv',
  },
  mediaCategory: {
    popular: 'popular',
    top_rated: 'top_rated',
  },
}));

describe('HomePage Component', () => {
  test('renders HomePage component correctly', () => {
    render(<HomePage />);

    expect(screen.getByTestId('hero-slide')).toBeInTheDocument();
    expect(screen.getAllByTestId('media-slide')).toHaveLength(4);
  });

  test('renders popular movies, popular series, top rated movies, and top rated series', () => {
    render(<HomePage />);

    expect(screen.getByText(/popular movies/i)).toBeInTheDocument();
    expect(screen.getByText(/popular series/i)).toBeInTheDocument();
    expect(screen.getByText(/top rated movies/i)).toBeInTheDocument();
    expect(screen.getByText(/top rated series/i)).toBeInTheDocument();

  });
});
