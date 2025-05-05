
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
				sans: ['DM Sans', 'sans-serif'],
				serif: ['Palatino', 'Georgia', 'serif'],
				oldstyle: ['"Playfair Display"', 'Georgia', 'serif'],
				ancient: ['"EB Garamond"', 'Times New Roman', 'serif'],
				hebrew: ['"SBL Hebrew"', 'Arial Hebrew', 'sans-serif'],
				greek: ['"SBL Greek"', 'New Athena Unicode', 'serif'],
				dmsans: ['DM Sans', 'sans-serif'],
			},
			letterSpacing: {
				tighter: '-0.02em',
				tight: '-0.01em',
				normal: '0',
				wide: '0.01em',
				wider: '0.02em',
				widest: '0.05em',
				modern: '-0.02em',
			},
			lineHeight: {
				relaxed: '1.4',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Bible app specific colors
				parchment: {
					light: '#f5f1e6',
					DEFAULT: '#e8e0cb',
					dark: '#d3c7a6',
					darker: '#9e8e63'
				},
				scripture: {
					heading: '#5c3f17',
					text: '#3a2a12',
					verse: '#5c3f17',
					highlight: {
						yellow: 'rgba(255, 213, 105, 0.4)',
						green: 'rgba(152, 219, 150, 0.4)',
						blue: 'rgba(145, 190, 242, 0.4)',
						purple: 'rgba(187, 155, 228, 0.4)',
						red: 'rgba(229, 146, 146, 0.4)',
					}
				},
				ancient: {
					brown: '#5c3f17',
					red: '#984a37',
					gold: '#c19237',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'page-turn': {
					'0%': { 
						transform: 'rotateY(0deg)',
						opacity: '1' 
					},
					'100%': { 
						transform: 'rotateY(10deg)', 
						opacity: '0.5' 
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'page-turn': 'page-turn 0.5s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out'
			},
			backgroundImage: {
				'parchment-texture': "url('/parchment-texture.jpg')",
				'parchment-dark': "url('/parchment-dark.jpg')",
				'ornamental-border': "url('/ornamental-border.png')",
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
