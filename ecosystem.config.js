module.exports = {
  apps: [
    {
      name: "final",
      cwd: "/home/codes/final",
      script: "pnpm",
      args: "start -- -p 3002",
      env: {
        NODE_ENV: "production",
        PORT: "3002 ",
		NEXT_PUBLIC_BASE_PATH: "/final",
        MONGODB_URI:mongodb+srv://jesoas33_db_user:EAoXFIiVHInq5G0A@finalcluster0.vmq9pdc.mongodb.net/?retryWrites=true&w=majority&appName=FinalCluster0
      },
      error_file: "/home/codes/final/pm2-error.log",
      out_file: "/home/codes/final/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    }
  ]
}
