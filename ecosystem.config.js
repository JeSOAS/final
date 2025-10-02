module.exports = {
  apps: [
    {
      name: "fin-customer",
      cwd: "/home/codes/fin-customer",
      script: "pnpm",
      args: "start -- 3002",
      env: {
        NODE_ENV: "production",
        PORT: "3002"
      },
      error_file: "/home/codes/fin-customer/pm2-error.log",
      out_file: "/home/codes/fin-customer/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    }
  ]
}
