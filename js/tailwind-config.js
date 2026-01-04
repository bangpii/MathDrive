module.exports = {
    content: ['./*.html', './components/*.html', './js/*.js'],
    theme: {
        extend: {
            fontFamily: {
                'poppins': ['Poppins', 'sans-serif'],
                'luckiest': ['"Luckiest Guy"', 'cursive']
            },
            animation: {
                'spin-slow': 'spin 20s linear infinite',
                'spin-medium': 'spin 15s linear infinite reverse',
                'spin-fast': 'spin 10s linear infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite',
                'fade-in': 'fadeIn 1s ease-in',
                'fade-in-up': 'fadeInUp 1s ease-out',
                // TAMBAHKAN ANIMASI BARU:
                'slow-spin': 'spin 25s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite 1s',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite'
            },
            keyframes: {
                // TAMBAHKAN KEYFRAMES BARU:
                float: {
                    '0%, 100%': {
                        transform: 'translateY(0px)'
                    },
                    '50%': {
                        transform: 'translateY(-20px)'
                    }
                },
                'pulse-glow': {
                    '0%, 100%': {
                        opacity: 1
                    },
                    '50%': {
                        opacity: 0.7
                    }
                }
            },
            backdropBlur: {
                'lg': '16px',
                'xl': '24px',
            }
        },
    },
    plugins: [],
}