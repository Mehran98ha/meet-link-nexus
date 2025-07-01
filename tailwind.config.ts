
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'vazir': ['Vazir', 'Vazirmatn', 'system-ui', 'sans-serif'],
				'vazirmatn': ['Vazir', 'Vazirmatn', 'system-ui', 'sans-serif'],
				'urbanist': ['Vazir', 'Vazirmatn', 'system-ui', 'sans-serif'], // Override with Vazir
				'roboto': ['Vazir', 'Vazirmatn', 'system-ui', 'sans-serif'], // Override with Vazir
			},
			colors: {
				// iOS System Colors
				'ios-blue': '#007AFF',
				'ios-purple': '#AF52DE',
				'ios-green': '#34C759',
				'ios-red': '#FF3B30',
				'ios-orange': '#FF9500',
				'ios-pink': '#FF2D92',
				'ios-teal': '#5AC8FA',
				'ios-indigo': '#5856D6',
				'ios-mint': '#00C7BE',
				'ios-cyan': '#32D74B',
				
				// iOS Gray Scale
				'ios-gray': '#8E8E93',
				'ios-gray-2': '#AEAEB2',
				'ios-gray-3': '#C7C7CC',
				'ios-gray-4': '#D1D1D6',
				'ios-gray-5': '#E5E5EA',
				'ios-gray-6': '#F2F2F7',
				
				// iOS System Backgrounds
				'ios-system-bg': '#F2F2F7',
				'ios-secondary-bg': '#FFFFFF',
				'ios-tertiary-bg': '#F2F2F7',
				
				// iOS Labels
				'ios-label': '#000000',
				'ios-secondary-label': '#3C3C43',
				'ios-tertiary-label': 'rgba(60, 60, 67, 0.6)',
				'ios-quaternary-label': 'rgba(60, 60, 67, 0.3)',
				
				// System colors for compatibility
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: '#F2F2F7',
				foreground: '#000000',
				primary: {
					DEFAULT: '#007AFF',
					foreground: '#FFFFFF',
					50: '#E6F3FF',
					100: '#CCE7FF',
					200: '#99CFFF',
					300: '#66B7FF',
					400: '#339FFF',
					500: '#007AFF',
					600: '#0056CC',
					700: '#004199',
					800: '#002B66',
					900: '#001533',
				},
				secondary: {
					DEFAULT: '#AF52DE',
					foreground: '#FFFFFF',
					50: '#F3E6FF',
					100: '#E7CCFF',
					200: '#CF99FF',
					300: '#B766FF',
					400: '#9F33FF',
					500: '#AF52DE',
					600: '#8A42B2',
					700: '#653285',
					800: '#402159',
					900: '#1B112C',
				},
				destructive: {
					DEFAULT: '#FF3B30',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F2F2F7',
					foreground: '#3C3C43'
				},
				accent: {
					DEFAULT: '#E5E5EA',
					foreground: '#000000'
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#000000'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#000000'
				},
				sidebar: {
					DEFAULT: 'rgba(255, 255, 255, 0.8)',
					foreground: '#000000',
					primary: '#007AFF',
					'primary-foreground': '#FFFFFF',
					accent: '#E5E5EA',
					'accent-foreground': '#000000',
					border: 'rgba(0, 0, 0, 0.1)',
					ring: '#007AFF'
				}
			},
			borderRadius: {
				'ios-sm': '8px',
				'ios-md': '12px',
				'ios-lg': '16px',
				'ios-xl': '20px',
				'ios-2xl': '24px',
				lg: '12px',
				md: '8px',
				sm: '6px'
			},
			fontSize: {
				// iOS Typography Scale
				'ios-title-1': ['34px', { lineHeight: '41px', fontWeight: '700' }],
				'ios-title-2': ['28px', { lineHeight: '34px', fontWeight: '700' }],
				'ios-title-3': ['22px', { lineHeight: '28px', fontWeight: '400' }],
				'ios-headline': ['17px', { lineHeight: '22px', fontWeight: '600' }],
				'ios-body': ['17px', { lineHeight: '22px', fontWeight: '400' }],
				'ios-callout': ['16px', { lineHeight: '21px', fontWeight: '400' }],
				'ios-subhead': ['15px', { lineHeight: '20px', fontWeight: '400' }],
				'ios-footnote': ['13px', { lineHeight: '18px', fontWeight: '400' }],
				'ios-caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
			},
			spacing: {
				// iOS 8px grid system
				'ios-xs': '4px',
				'ios-sm': '8px',
				'ios-md': '16px',
				'ios-lg': '24px',
				'ios-xl': '32px',
				'ios-2xl': '40px',
				'ios-3xl': '48px',
			},
			boxShadow: {
				// iOS-style shadows
				'ios-sm': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
				'ios-md': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
				'ios-lg': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
				'ios-xl': '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
			},
			backdropBlur: {
				'ios': '20px',
			},
			keyframes: {
				// iOS-style animations
				'ios-spring': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(0.95)' },
					'100%': { transform: 'scale(1)' }
				},
				'ios-fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'ios-slide-up': {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' }
				},
				'ios-bounce': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' }
				}
			},
			animation: {
				'ios-spring': 'ios-spring 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
				'ios-fade-in': 'ios-fade-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'ios-slide-up': 'ios-slide-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'ios-bounce': 'ios-bounce 2s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
