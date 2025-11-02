import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from '@/components/ThemeToggle';

// Mock the ThemeContext module
const mockToggleTheme = jest.fn();

// Mock the ThemeProvider
jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    resolvedTheme: 'light',
    setTheme: jest.fn(),
    toggleTheme: mockToggleTheme,
    isDarkMode: false,
  }),
}));

// Mock the Lucide React icons
jest.mock('lucide-react', () => ({
  Sun: () => <svg data-testid="sun-icon" />,
  Moon: () => <svg data-testid="moon-icon" />
}));

describe('ThemeToggle', () => {
  it('renders the sun icon when in light mode', () => {
    render(<ThemeToggle />);
    
    // Check if the button is rendered with correct attributes
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    expect(button).toHaveAttribute('title', 'Switch to dark mode');
    
    // Check if the sun icon is present (since we're in light mode)
    const sunIcon = screen.getByTestId('sun-icon');
    expect(sunIcon).toBeInTheDocument();
  });

  it('calls toggleTheme when the button is clicked', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    button.click();
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
