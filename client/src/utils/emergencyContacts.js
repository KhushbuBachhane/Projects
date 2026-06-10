export const NATIONAL_EMERGENCY_HELPLINES = [
  {
    id: 'helpline-112',
    name: 'National Emergency Number',
    phone: '112',
    category: 'Government Helpline',
    description: 'Single emergency number for police, fire, and ambulance (ERSS)',
  },
  {
    id: 'helpline-100',
    name: 'Police',
    phone: '100',
    category: 'Government Helpline',
    description: 'Report crimes and request police assistance',
  },
  {
    id: 'helpline-101',
    name: 'Fire Brigade',
    phone: '101',
    category: 'Government Helpline',
    description: 'Fire emergencies and rescue operations',
  },
  {
    id: 'helpline-102',
    name: 'Ambulance',
    phone: '102',
    category: 'Ambulance',
    description: 'Medical emergencies and ambulance dispatch',
  },
  {
    id: 'helpline-108',
    name: 'Emergency Ambulance (EMRI)',
    phone: '108',
    category: 'Ambulance',
    description: 'Free 24/7 ambulance service across India',
  },
  {
    id: 'helpline-1091',
    name: 'Women Helpline',
    phone: '1091',
    category: 'Government Helpline',
    description: 'Support for women in distress',
  },
  {
    id: 'helpline-1078',
    name: 'NDMA Disaster Helpline',
    phone: '1078',
    category: 'Disaster Management',
    description: 'National Disaster Management Authority helpline',
  },
  {
    id: 'helpline-1070',
    name: 'NDRF Control Room',
    phone: '1070',
    category: 'Disaster Management',
    description: 'National Disaster Response Force coordination',
  },
];

export function mergeEmergencyContacts(apiContacts = []) {
  const seen = new Set(NATIONAL_EMERGENCY_HELPLINES.map((c) => c.phone));
  const extra = apiContacts.filter((c) => !seen.has(c.phone));
  return [...NATIONAL_EMERGENCY_HELPLINES, ...extra];
}
