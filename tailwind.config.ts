import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        border: 'hsl(var(--border))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        ring: 'hsl(var(--ring))'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(100, 116, 139, 0.12)',
        mist: '0 18px 40px rgba(94, 108, 132, 0.12)'
      },
      borderRadius: {
        xl2: '1.5rem'
      },
      backgroundImage: {
        fog: 'radial-gradient(circle at top, rgba(255,255,255,0.9), rgba(245,242,237,0.65) 45%, rgba(238,235,231,0.85) 100%)'
      }
    }
  },
  plugins: []
};

export default config;
