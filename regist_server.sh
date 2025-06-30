#! /bin/bash
echo "PM2 Regist All Server"

# Navigate to the directory containing your PM2 ecosystem file
cd /home/xrsporter.launcher/rootnode

# Flush PM2 logs (optional)
pm2 flush

# Delete existing PM2 process (if it exists)
pm2 delete 'launcher-prod'

# Start the PM2 process with the ecosystem config
NODE_ENV=production pm2 start ecosystem.config.js --env production

# Optional: Save the PM2 process list to be resurrected on reboot
pm2 save
