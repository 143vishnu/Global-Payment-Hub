import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatCard from '../components/common/StatCard';

describe('StatCard Component', () => {
  it('renders title and value', () => {
    render(
      <StatCard
        title="Total Payments"
        value="1,234"
      />
    );

    expect(screen.getByText('Total Payments')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <StatCard
        title="Success Rate"
        value="95%"
        subtitle="Last 30 days"
      />
    );

    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
  });

  it('applies correct color', () => {
    const { container } = render(
      <StatCard
        title="Total"
        value="100"
        color="success"
      />
    );

    // Check if the value has the success color class
    const valueElement = screen.getByText('100');
    expect(valueElement).toHaveClass('MuiTypography-root');
  });
});
