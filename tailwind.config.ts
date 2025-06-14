
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
				// Bible app specific colors - Cores mais jovens e vibrantes
				bible: {
					background: '#f0e9d8',
					box: '#e9e0cc',
					controls: '#f5f1e6',
					title: '#5e4119',
					subtitle: '#984b38'
				},
				parchment: {
					light: '#f5f1e6',
					DEFAULT: '#e9e0cc',
					dark: '#ece5d4',
					darker: '#9e8e63'
				},
				scripture: {
					heading: '#5e4119',
					text: '#3a2a12',
					verse: '#5e4119',
					subtitle: '#984b38',
					highlight: {
						yellow: 'rgba(255, 213, 105, 0.6)',
						green: 'rgba(152, 219, 150, 0.6)',
						blue: 'rgba(145, 190, 242, 0.6)',
						purple: 'rgba(187, 155, 228, 0.6)',
						red: 'rgba(229, 146, 146, 0.6)',
					}
				},
				ancient: {
					brown: '#5e4119',
					red: '#984b38',
					gold: '#f59e0b', // Mais vibrante
				},
				// Cores jovens adicionais
				vibrant: {
					purple: '#8b5cf6',
					pink: '#ec4899',
					blue: '#3b82f6',
					green: '#10b981',
					orange: '#f97316',
					yellow: '#eab308',
					indigo: '#6366f1',
					teal: '#14b8a6',
					rose: '#f43f5e',
					emerald: '#059669',
					cyan: '#06b6d4',
					lime: '#65a30d',
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
				},
				'bounce-gentle': {
					'0%, 100%': { 
						transform: 'translateY(0)', 
						animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' 
					},
					'50%': { 
						transform: 'translateY(-10%)', 
						animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' 
					}
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.7)' 
					},
					'70%': { 
						boxShadow: '0 0 0 10px rgba(139, 92, 246, 0)' 
					}
				},
				'shimmer': {
					'0%': { 
						backgroundPosition: '-200% 0' 
					},
					'100%': { 
						backgroundPosition: '200% 0' 
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'page-turn': 'page-turn 0.5s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'bounce-gentle': 'bounce-gentle 2s infinite',
				'pulse-glow': 'pulse-glow 2s infinite',
				'shimmer': 'shimmer 2s infinite linear'
			},
			backgroundImage: {
				'parchment-texture': "url('/parchment-texture.jpg')",
				'parchment-dark': "url('/parchment-dark.jpg')",
				'ornamental-border': "url('/ornamental-border.png')",
				'bible-gradient': 'linear-gradient(135deg, #f0e9d8, #faf5f0)',
				'vibrant-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				'young-gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
				'fresh-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
				'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
