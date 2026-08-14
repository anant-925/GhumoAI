import type { GuideContent, Review } from '@/lib/types';

export const MOCK_GUIDE: GuideContent = {
  destination: 'Jaipur',
  generated_at: '2025-07-01T10:00:00Z',
  content_markdown: `# Jaipur — The Pink City

## Historical Background

Jaipur, the capital of Rajasthan, was founded in 1727 by Maharaja Sawai Jai Singh II. It holds the distinction of being India's **first planned city**, designed by the Bengali architect Vidyadhar Bhattacharya using principles of Vastu Shastra and the Shilpa Shastra.

The city gets its iconic name "Pink City" from 1876, when the entire old city was painted terracotta pink to welcome the Prince of Wales and Queen Victoria. This tradition continues today — it's actually a law that buildings in the old city must maintain their pink façade.

## Key Cultural Highlights

### The Living Heritage
Jaipur is a **UNESCO World Heritage Site** (inscribed 2019), recognized for its exceptional urban planning and architecture. The city seamlessly blends its royal past with a vibrant modern culture of art, textiles, and cuisine.

### Textile Capital
Jaipur is renowned for its **block printing**, **bandhani** (tie-dye), and **leheriya** (wave-patterned) textiles. Visit the workshops in Sanganer to see artisans practicing techniques unchanged for centuries.

## Must-See Monuments

### 🏰 Amber Fort (Amer Fort)
- **Built**: 1592 by Raja Man Singh I
- **Highlight**: The Sheesh Mahal (Mirror Palace) — thousands of mirror fragments create a dazzling display with just a single candle
- **Best time**: Early morning (8 AM) to avoid crowds
- **Pro tip**: Take the elephant ride up or walk the stepped path for stunning views

### 🏛️ Hawa Mahal (Palace of Winds)
- **Built**: 1799 by Maharaja Sawai Pratap Singh
- **Highlight**: 953 small windows (jharokhas) designed for royal women to observe street festivals
- **Best time**: Early morning when the sunrise lights up the pink sandstone façade

### 🏰 City Palace
- **Highlight**: Still partially occupied by the royal family — a living palace
- **Must see**: The Pitam Niwas Chowk with its four stunning peacock-themed gates representing the four seasons

### 🔭 Jantar Mantar
- **Built**: 1734 by Jai Singh II
- **Highlight**: World's largest stone sundial (the Samrat Yantra, 27m tall)
- **Fun fact**: Can tell time accurate to 2 seconds!

### 🏔️ Nahargarh Fort
- **Highlight**: Best panoramic views of the city, especially at sunset
- **Pro tip**: Visit the Padao Restaurant for dinner with a view

## Local Cuisine Recommendations

| Dish | Where to Try | Price Range |
|------|-------------|-------------|
| **Dal Baati Churma** | Chokhi Dhani | ₹300-500 |
| **Laal Maas** | Handi Restaurant | ₹400-600 |
| **Ghewar** | LMB (Laxmi Mishthan Bhandar) | ₹150-300 |
| **Pyaaz Kachori** | Rawat Mishthan Bhandar | ₹30-50 |
| **Kulfi Falooda** | Pandit Kulfi | ₹60-100 |

## Best Times to Visit

- **October–March**: Ideal weather (15°C–25°C). Peak season for tourism.
- **Avoid**: May–June (temperatures exceed 45°C)
- **Festival season**: Diwali (October/November) — the city lights up spectacularly
- **Jaipur Literature Festival**: January — the world's largest free literary festival

> 💡 **Insider Tip**: Visit the Bazaars (Johari Bazaar, Tripolia Bazaar, Bapu Bazaar) in the late afternoon when the heat subsides and the markets come alive with colors and energy.
`,
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-001',
    author_name: 'Priya Mehta',
    rating: 5,
    text: 'Absolutely stunning! The Sheesh Mahal in Amber Fort is breathtaking. Go early morning to avoid the crowds. The elephant ride is a unique experience.',
    created_at: '2025-05-10T14:30:00Z',
  },
  {
    id: 'rev-002',
    author_name: 'Rajesh Kumar',
    rating: 4,
    text: 'Great historical monument with excellent architecture. The guide was very knowledgeable. Only downside was the long queue for tickets.',
    created_at: '2025-04-22T11:15:00Z',
  },
  {
    id: 'rev-003',
    author_name: 'Sarah Wilson',
    rating: 5,
    text: 'One of the best forts I have visited in India. The views from the top are spectacular. Must visit for anyone traveling to Jaipur!',
    created_at: '2025-03-15T09:45:00Z',
  },
  {
    id: 'rev-004',
    author_name: 'Amit Patel',
    rating: 3,
    text: 'Beautiful place but very crowded on weekends. The entry fee has increased recently. Would recommend visiting on a weekday.',
    created_at: '2025-02-28T16:00:00Z',
  },
  {
    id: 'rev-005',
    author_name: 'Meera Joshi',
    rating: 4,
    text: 'The light and sound show in the evening is a must-see! The palace complex is massive — give yourself at least 2-3 hours.',
    created_at: '2025-01-18T18:20:00Z',
  },
];
