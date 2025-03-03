import { render, screen, fireEvent } from '@testing-library/react';
import { Filters } from '../../products/Filters';
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'> & { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));

describe('Filters', () => {
  const mockProps = {
    localNameFilter: '',
    localPriceFilter: '',
    localExpirationFilter: '',
    setLocalNameFilter: jest.fn(),
    setLocalPriceFilter: jest.fn(),
    setLocalExpirationFilter: jest.fn(),
    limit: 10,
    setLimit: jest.fn(),
  };

  it('renders all filter inputs and limit select', () => {
    render(<Filters {...mockProps} />);
    expect(screen.getByPlaceholderText(/filter by name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/filter by price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/filter by expiration/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('10');
  });

  it('calls setLocalNameFilter on name input change', () => {
    render(<Filters {...mockProps} />);
    const input = screen.getByPlaceholderText(/filter by name/i);
    fireEvent.change(input, { target: { value: 'test' } });
    expect(mockProps.setLocalNameFilter).toHaveBeenCalledWith('test');
  });

  it('calls setLimit on limit select change', () => {
    render(<Filters {...mockProps} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '20' } });
    expect(mockProps.setLimit).toHaveBeenCalledWith(20);
  });
});