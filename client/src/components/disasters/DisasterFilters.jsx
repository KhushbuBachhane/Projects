import { Search } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { CATEGORIES, SEVERITIES } from '../../utils/constants';

export default function DisasterFilters({ filters, onChange, onReset }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search reports..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Category"
          placeholder="All Categories"
          options={CATEGORIES}
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
        />
        <Select
          label="Severity"
          placeholder="All Severities"
          options={SEVERITIES}
          value={filters.severity}
          onChange={(e) => handleChange('severity', e.target.value)}
        />
        <Input
          label="From Date"
          type="date"
          value={filters.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
        />
        <Input
          label="To Date"
          type="date"
          value={filters.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
        />
      </div>
      <Button variant="ghost" size="sm" onClick={onReset}>
        Clear Filters
      </Button>
    </div>
  );
}
