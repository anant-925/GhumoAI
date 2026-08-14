import type { Stopover } from '@/lib/types';

export const MOCK_STOPOVERS: Stopover[] = [
  {
    id: 'stop-001',
    name: 'Neemrana Fort Palace',
    lat: 27.9870,
    lng: 76.3865,
    distance_from_route_km: 2.5,
    nearby_stays: [
      {
        name: 'Neemrana Fort Palace Hotel',
        rating: 4.6,
        price_per_night: 4500,
        booking_url: 'https://www.neemranahotels.com',
      },
      {
        name: 'OYO Townhouse Neemrana',
        rating: 3.8,
        price_per_night: 1200,
      },
    ],
  },
  {
    id: 'stop-002',
    name: 'Behror',
    lat: 27.8896,
    lng: 76.2850,
    distance_from_route_km: 0.8,
    nearby_stays: [
      {
        name: 'Dera Amer Jungle Resort',
        rating: 4.2,
        price_per_night: 3200,
      },
      {
        name: 'Hotel Highway King',
        rating: 3.5,
        price_per_night: 900,
      },
    ],
  },
  {
    id: 'stop-003',
    name: 'Shahpura',
    lat: 27.3900,
    lng: 75.9600,
    distance_from_route_km: 3.1,
    nearby_stays: [
      {
        name: 'Shahpura Haveli',
        rating: 4.0,
        price_per_night: 2800,
      },
    ],
  },
];
