/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#10141f',
        panelEdge: '#27314a',
        ember: '#f97316',
        neon: '#22d3ee',
        danger: '#ef4444',
        moss: '#34d399'
      },
      boxShadow: {
        panel: '0 20px 60px rgba(0, 0, 0, 0.4)',
        glow: '0 0 0 1px rgba(56, 189, 248, 0.3), 0 10px 35px rgba(14, 165, 233, 0.2)'
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif']
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(34, 211, 238, 0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(34, 211, 238, 0.35)' }
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      },
      animation: {
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        floatSlow: 'floatSlow 3s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
