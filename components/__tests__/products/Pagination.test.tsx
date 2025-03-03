import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../../products/Pagination';


jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'> & { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));

describe('Pagination', () => {
  const mockProps = {
    page: 2,
    totalPages: 5,
    isLoading: false,
    isTransitioning: false,
    handlePageChange: jest.fn(),
  };

  it('renders pagination controls with correct page info', () => {
    render(<Pagination {...mockProps} />);
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('calls handlePageChange on Previous click', () => {
    render(<Pagination {...mockProps} />);
    fireEvent.click(screen.getByText('Previous'));
    expect(mockProps.handlePageChange).toHaveBeenCalledWith(1);
  });

  it('disables Previous button on first page', () => {
    render(<Pagination {...mockProps} page={1} />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });
});