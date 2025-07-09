import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
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
  			teen: {
  				purple: 'hsl(var(--teen-purple))',
  				pink: 'hsl(var(--teen-pink))',
  				blue: 'hsl(var(--teen-blue))',
  				green: 'hsl(var(--teen-green))',
  				orange: 'hsl(var(--teen-orange))',
  				yellow: 'hsl(var(--teen-yellow))',
  				coral: 'hsl(var(--teen-coral))',
  				mint: 'hsl(var(--teen-mint))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			'cute': ['Comic Neue', 'cursive'],
  			'modern': ['Poppins', 'sans-serif']
  		},
  		backgroundImage: {
  			'gradient-teen': 'var(--gradient-main)',
  			'gradient-success': 'var(--gradient-success)',
  			'gradient-energy': 'var(--gradient-energy)',
  			'gradient-cool': 'var(--gradient-cool)'
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
  			'bounce-in': {
  				'0%': {
  					transform: 'scale(0.3)',
  					opacity: '0'
  				},
  				'50%': {
  					transform: 'scale(1.05)'
  				},
  				'70%': {
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			'wiggle': {
  				'0%, 7%, 100%': {
  					transform: 'rotate(0deg)'
  				},
  				'15%': {
  					transform: 'rotate(-3deg)'
  				},
  				'20%': {
  					transform: 'rotate(3deg)'
  				},
  				'25%': {
  					transform: 'rotate(-3deg)'
  				},
  				'30%': {
  					transform: 'rotate(3deg)'
  				},
  				'35%': {
  					transform: 'rotate(-1deg)'
  				},
  				'40%': {
  					transform: 'rotate(1deg)'
  				},
  				'50%': {
  					transform: 'rotate(0deg)'
  				}
  			},
  			'float': {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
  			},
  			'pulse-rainbow': {
  				'0%, 100%': {
  					background: 'hsl(var(--teen-purple))'
  				},
  				'25%': {
  					background: 'hsl(var(--teen-pink))'
  				},
  				'50%': {
  					background: 'hsl(var(--teen-blue))'
  				},
  				'75%': {
  					background: 'hsl(var(--teen-mint))'
  				}
  			},
  			'sparkle': {
  				'0%, 100%': {
  					opacity: '0',
  					transform: 'scale(0)'
  				},
  				'50%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  			'wiggle': 'wiggle 1s ease-in-out',
  			'float': 'float 3s ease-in-out infinite',
  			'pulse-rainbow': 'pulse-rainbow 3s infinite',
  			'sparkle': 'sparkle 1.5s ease-in-out infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
