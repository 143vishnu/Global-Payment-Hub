import { formatCurrency, formatDateTime, formatNumber, getStatusColor } from '../utils/helpers';

describe('Helper Functions', () => {
  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
    });

    it('handles null and undefined', () => {
      expect(formatCurrency(null)).toBe('-');
      expect(formatCurrency(undefined)).toBe('-');
    });
  });

  describe('formatDateTime', () => {
    it('formats date correctly', () => {
      const date = new Date('2026-01-15T10:30:00');
      const formatted = formatDateTime(date);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2026');
    });

    it('handles invalid date', () => {
      expect(formatDateTime(null)).toBe('-');
      expect(formatDateTime(undefined)).toBe('-');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('handles null and undefined', () => {
      expect(formatNumber(null)).toBe('-');
      expect(formatNumber(undefined)).toBe('-');
    });
  });

  describe('getStatusColor', () => {
    it('returns correct colors for statuses', () => {
      expect(getStatusColor('SUCCESS')).toBe('success');
      expect(getStatusColor('FAILED')).toBe('error');
      expect(getStatusColor('PENDING')).toBe('warning');
      expect(getStatusColor('PROCESSING')).toBe('info');
    });

    it('returns default for unknown status', () => {
      expect(getStatusColor('UNKNOWN')).toBe('default');
      expect(getStatusColor(null)).toBe('default');
    });
  });
});
