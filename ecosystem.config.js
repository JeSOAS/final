module.exports = {
  apps: [
    {
      name: "final",
      cwd: "/home/codes/final",
      script: "pnpm",
      args: "start -- 3002",
      env: {
        NODE_ENV: "production",
        PORT: "3002"
      },
      error_file: "/home/codes/final/pm2-error.log",
      out_file: "/home/codes/final/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    }
  ]
}
