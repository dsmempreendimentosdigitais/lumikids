const PLANS = {
  free: {
    name: 'Gratuito', price: 0,
    aiPerWeek: 2, profiles: 1,
    premiumVoices: false, offline: false, ads: true,
  },
  start: {
    name: 'Start', price: 1490,
    aiPerWeek: 999, profiles: 2,
    premiumVoices: false, offline: false, ads: false,
  },
  familia: {
    name: 'Família', price: 2490,
    aiPerMonth: 30, profiles: 4,
    premiumVoices: true, offline: false, ads: false,
  },
  familia_plus: {
    name: 'Família+', price: 3990,
    aiPerMonth: 100, profiles: 4,
    premiumVoices: true, offline: true, ads: false,
  },
  premium2: {
    name: 'Premium2', price: 5990,
    aiPerMonth: 999, profiles: 6,
    premiumVoices: true, offline: true, ads: false,
  },
};
