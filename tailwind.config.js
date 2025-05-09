module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        status: {
          ready: '#6ee7b7',
          progress: '#60a5fa',
          review: '#fcd34d',
          deploy: '#a78bfa',
          done: '#34d399',
          stuck: '#f87171',
        },
        priority: {
          critical: '#ef4444',
          high: '#f97316',
          medium: '#facc15',
          low: '#10b981',
          best: '#3b82f6'
        }
      }
    }
  },
  
  plugins: [],
}
