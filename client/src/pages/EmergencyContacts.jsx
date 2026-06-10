import { useEffect, useState } from 'react';
import { Phone, Ambulance, ShieldAlert } from 'lucide-react';
import { emergencyAPI } from '../services/api';
import { mergeEmergencyContacts } from '../utils/emergencyContacts';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    emergencyAPI.getAll()
      .then(({ data }) => setContacts(mergeEmergencyContacts(data.data)))
      .catch(() => setContacts(mergeEmergencyContacts([])))
      .finally(() => setLoading(false));
  }, []);

  const grouped = contacts.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {});

  const categoryOrder = ['Government Helpline', 'Ambulance', 'Disaster Management'];
  const sortedCategories = [
    ...categoryOrder.filter((cat) => grouped[cat]),
    ...Object.keys(grouped).filter((cat) => !categoryOrder.includes(cat)),
  ];

  if (loading) return <Spinner className="min-h-[60vh]" size="lg" />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Emergency Contacts</h1>
      <p className="mt-1 text-gray-500 dark:text-gray-400">
        Government helplines and ambulance numbers for immediate assistance
      </p>

      <Card className="mt-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
            <div>
              <h2 className="font-semibold text-red-700 dark:text-red-400">Life-threatening emergency?</h2>
              <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                Dial the national emergency number immediately. Available 24/7 across India.
              </p>
            </div>
          </div>
          <a
            href="tel:112"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-lg font-bold text-white shadow-sm transition-colors hover:bg-red-700"
          >
            <Phone className="h-5 w-5" />
            Call 112
          </a>
        </div>
      </Card>

      <div className="mt-8 space-y-8">
        {sortedCategories.map((category) => (
          <div key={category}>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-600 dark:text-brand-400">
              {category === 'Ambulance' ? (
                <Ambulance className="h-5 w-5" />
              ) : (
                <Phone className="h-5 w-5" />
              )}
              {category}
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {grouped[category].map((contact) => (
                <Card key={contact._id || contact.id} className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold">{contact.name}</h3>
                    {contact.description && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{contact.description}</p>
                    )}
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-brand-700 font-semibold transition-colors hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300 dark:hover:bg-brand-900/50"
                  >
                    <Phone className="h-4 w-4" />
                    {contact.phone}
                  </a>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
