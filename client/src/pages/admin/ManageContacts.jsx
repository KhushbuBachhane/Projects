import { useEffect, useState } from 'react';
import { Plus, Trash2, Phone } from 'lucide-react';
import { emergencyAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

export default function ManageContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', category: '', description: '' });

  const fetchContacts = async () => {
    try {
      const { data } = await emergencyAPI.getAll();
      setContacts(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await emergencyAPI.create(form);
    setModalOpen(false);
    setForm({ name: '', phone: '', category: '', description: '' });
    fetchContacts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return;
    await emergencyAPI.delete(id);
    fetchContacts();
  };

  if (loading) return <Spinner className="min-h-[60vh]" size="lg" />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Emergency Contacts</h1>
          <p className="mt-1 text-gray-500">{contacts.length} contacts</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Add Contact
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {contacts.map((c) => (
          <Card key={c._id} className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-gray-500">{c.category} — {c.phone}</p>
              {c.description && <p className="text-xs text-gray-400 mt-1">{c.description}</p>}
            </div>
            <Button size="sm" variant="danger" onClick={() => handleDelete(c._id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Emergency Contact">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Category" required placeholder="e.g. Police, Fire, Medical" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Button type="submit" className="w-full">Add Contact</Button>
        </form>
      </Modal>
    </div>
  );
}
