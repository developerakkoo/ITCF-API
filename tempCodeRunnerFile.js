const Bree = require('bree');

// Create a new Bree instance
const bree = new Bree({
  jobs: [
    {
      name: 'task',
      cron: '* * * * *', // Runs at 12:00 AM every day
      path: './task.js',
    },
    // {
    //   name: 'task2',
    //   cron: '0 12 * * *', // Runs at 12:00 PM every day
    //   path: '/path/to/task2.js',
    // },
  ],
});

// Start the scheduled jobs
bree.start();
