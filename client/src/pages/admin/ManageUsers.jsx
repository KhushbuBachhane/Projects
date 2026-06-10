import { useEffect, useState } from 'react';
import { Trash2, Shield, User } from 'lucide-react';
import { userAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';

export default function ManageUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await userAPI.getAll();
      setUsers(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, role) => {
    await userAPI.updateRole(id, role);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    await userAPI.delete(id);
    fetchUsers();
  };

  if (loading) return <Spinner className="min-h-[60vh]" size="lg" />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <p className="mt-1 text-gray-500">{users.length} registered users</p>

      <div className="mt-6 space-y-3">
        {users.map((u) => (
          <Card key={u._id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                {u.role === 'admin' ? <Shield className="h-5 w-5 text-purple-600" /> : <User className="h-5 w-5 text-gray-500" />}
              </div>
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
            </div>
            {u._id !== currentUser._id && (
              <div className="flex items-center gap-2">
                <Select
                  options={['user', 'admin']}
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  className="!py-1"
                />
                <Button size="sm" variant="danger" onClick={() => handleDelete(u._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
