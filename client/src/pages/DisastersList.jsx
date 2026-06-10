import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { disasterAPI } from '../services/api';
import DisasterFilters from '../components/disasters/DisasterFilters';
import { DisasterCardLink } from '../components/disasters/DisasterCard';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

const defaultFilters = { search: '', category: '', severity: '', startDate: '', endDate: '' };

export default function DisastersList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [disasters, setDisasters] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    ...defaultFilters,
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    severity: searchParams.get('severity') || '',
  });

  const fetchDisasters = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.severity) params.severity = filters.severity;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const { data } = await disasterAPI.getAll(params);
      setDisasters(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => fetchDisasters(1), 300);
    return () => clearTimeout(timer);
  }, [fetchDisasters]);

  const handleReset = () => {
    setFilters(defaultFilters);
    setSearchParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Disaster Reports</h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Browse and search all reported disasters
      </p>

      <div className="mt-6">
        <DisasterFilters filters={filters} onChange={setFilters} onReset={handleReset} />
      </div>

      {loading ? (
        <Spinner className="py-20" size="lg" />
      ) : (
        <>
          <p className="mt-4 text-sm text-gray-500">{pagination.total} reports found</p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {disasters.map((d) => (
              <DisasterCardLink key={d._id} disaster={d} />
            ))}
          </div>
          {!disasters.length && (
            <p className="py-20 text-center text-gray-500">No reports match your filters.</p>
          )}
          {pagination.pages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchDisasters(pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-3 text-sm text-gray-500">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchDisasters(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
