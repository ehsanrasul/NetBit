import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ReviewList from './ReviewList';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import reviewApi from '../api/modules/review.api';

jest.mock('../api/modules/review.api', () => ({
  getList: jest.fn(() => ({ response: [], err: null })),
  remove: jest.fn(() => ({ response: null, err: null })),
}));

const mockStore = configureStore([]);

describe('ReviewList Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      reviews: {
        // Mock your reviews state here
      },
    });
  });

  test('renders ReviewList component correctly', async () => {
    render(
      <Provider store={store}>
        <ReviewList />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Your reviews/i)).toBeInTheDocument();
    });
  });

  test('handles API response correctly', async () => {
    const mockedReviews = [
      {
        id: 1,
        mediaTitle: 'Movie Title 1',
        mediaType: 'movie',
        mediaid: 123,
        mediaPoster: 'path/to/poster1.jpg',
        createdAt: '2022-01-01T12:00:00',
        content: 'This is a review.',
      },
      {
        id: 2,
        mediaTitle: 'Movie Title 2',
        mediaType: 'movie',
        mediaid: 456,
        mediaPoster: 'path/to/poster2.jpg',
        createdAt: '2022-02-02T14:30:00',
        content: 'Another review.',
      },
    ];

    jest.mock('../api/modules/review.api', () => ({
      getList: jest.fn(() => ({ response: mockedReviews, err: null })),
      remove: jest.fn(() => ({ response: null, err: null })),
    }));

    render(
      <Provider store={store}>
        <ReviewList />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Movie Title 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Movie Title 2/i)).toBeInTheDocument();
    });
  });

  test('handles review removal correctly', async () => {
    const mockedReviews = [
      {
        id: 1,
        mediaTitle: 'Movie Title 1',
        mediaType: 'movie',
        mediaid: 123,
        mediaPoster: 'path/to/poster1.jpg',
        createdAt: '2022-01-01T12:00:00',
        content: 'This is a review.',
      },
    ];

    jest.mock('../api/modules/review.api', () => ({
      getList: jest.fn(() => ({ response: mockedReviews, err: null })),
      remove: jest.fn(() => ({ response: null, err: null })),
    }));

    render(
      <Provider store={store}>
        <ReviewList />
      </Provider>
    );

    await waitFor(() => {
      const removeButton = screen.getByText(/remove/i);
      fireEvent.click(removeButton);
    });

    expect(reviewApi.remove).toHaveBeenCalledTimes(1);
    expect(reviewApi.remove).toHaveBeenCalledWith({ reviewId: 1 });
  });
});