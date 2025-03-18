export interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
}

export const countries: Country[] = [
  {
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    dialCode: '+1'
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    dialCode: '+44'
  },
  {
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    dialCode: '+1'
  },
  {
    name: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    dialCode: '+61'
  },
  {
    name: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
    dialCode: '+49'
  },
  {
    name: 'France',
    code: 'FR',
    flag: '🇫🇷',
    dialCode: '+33'
  },
  {
    name: 'Spain',
    code: 'ES',
    flag: '🇪🇸',
    dialCode: '+34'
  },
  {
    name: 'Italy',
    code: 'IT',
    flag: '🇮🇹',
    dialCode: '+39'
  },
  {
    name: 'Japan',
    code: 'JP',
    flag: '🇯🇵',
    dialCode: '+81'
  },
  {
    name: 'China',
    code: 'CN',
    flag: '🇨🇳',
    dialCode: '+86'
  },
  {
    name: 'India',
    code: 'IN',
    flag: '🇮🇳',
    dialCode: '+91'
  },
  {
    name: 'Brazil',
    code: 'BR',
    flag: '🇧🇷',
    dialCode: '+55'
  }
];