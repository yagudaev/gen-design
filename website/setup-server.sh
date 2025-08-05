echo "🚀 Starting server setup and configuration"

# login as root
echo "👤 Setting up Ubuntu user account"
# setup a user similar for Hertzner similar to how EC2 is setup
adduser --disabled-password --gecos "" ubuntu
usermod -aG sudo ubuntu
echo 'ubuntu ALL=(ALL) NOPASSWD:ALL' | EDITOR='tee -a' visudo
mkdir -p /home/ubuntu/.ssh
chmod 700 /home/ubuntu/.ssh
chown ubuntu:ubuntu /home/ubuntu/.ssh
cp /root/.ssh/authorized_keys /home/ubuntu/.ssh/authorized_keys
chmod 600 /home/ubuntu/.ssh/authorized_keys
chown ubuntu:ubuntu /home/ubuntu/.ssh/authorized_keys

# login as ubuntu
echo "📦 Installing Node.js"
sudo apt update -y
sudo apt install nodejs -y
sudo apt install npm -y

echo "🔄 Installing NVM and Node.js 22"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
nvm alias default 22
node -v # Verify version

echo "🔄 Installing PM2 process manager"
npm install pm2 -g

echo "📦 Installing Yarn package manager"
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn -y

echo "🔒 Setting up SSL certificates with Certbot"
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

echo "🔑 Generating SSL certificates"
sudo certbot certonly --standalone \
  --non-interactive \
  --agree-tos \
  --email michael@vibeflow.sh \
  --domains vibeflow.sh \
  --domains www.vibeflow.sh

# certificate will be at /etc/letsencrypt/live/ffmpeg.vibeflow.sh/fullchain.pem
# key: /etc/letsencrypt/live/ffmpeg.vibeflow.sh/privkey.pem
# expires 2024-07-23

echo "⏰ Setting up certificate auto-renewal"
sudo certbot renew --pre-hook "sudo -u ubuntu /home/ubuntu/.nvm/versions/node/v22.15.0/bin/pm2 stop all" --post-hook "sudo -u ubuntu /home/ubuntu/.nvm/versions/node/v22.15.0/bin/pm2 start all"

echo "🔑 Generating SSH key for GitHub access"
ssh-keygen -t rsa -b 4096 -C "deploy@vibeflow.sh"
cat ~/.ssh/id_rsa.pub
# copy the output and add it to github

echo "📂 Setting up code directory and cloning repository"
mkdir code && cd code
git clone git@github.com:yagudaev/vibeflow.git
git checkout main

echo "📦 Installing application dependencies"
# sudo apt install ffmpeg -y

echo "🏗️ Setting up website"
cd ~/code/vibeflow/website
yarn install
yarn build

echo "📦 Installing additional tools"
sudo apt-get install socat
sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

echo "🖥️ Installing Puppeteer dependencies"
sudo apt-get update && sudo apt-get install -y \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2t64 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0

echo "🔄 Configuring PM2 to start on system boot"
pm2 startup
# manually need to run the command that pm2 gives you above (here it is below)
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v22.15.0/bin /home/ubuntu/.nvm/versions/node/v22.15.0/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo "🚀 Deploying application"
yarn deploy

# setup a cron job
echo "⏰ Setting up maintenance cron job"
crontab -e
# cron command
# 0 * * * * cd /home/ubuntu/code/vibeflow-ffmpeg && /usr/bin/yarn delete-old-tmp-files

# setup env
echo "⚙️ Setting up environment variables"
cp .env.sample .env
# echo "EC2_API_TOKEN=" >> .env
# Need to manually edit .env file and add the token

echo "🐘 Setting up PostgreSQL database"
sudo apt install postgresql postgresql-contrib -y

echo "🔑 Generating secure database credentials"
export DB_USER=vibeflow
export DB_NAME=vibeflow
export DB_PASSWORD=$(openssl rand -base64 32 | tr '/' '_' | tr '+' '-')
export POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr '/' '_' | tr '+' '-')

echo "🚀 Starting PostgreSQL and enabling on boot"
sudo systemctl start postgresql
sudo systemctl enable postgresql

echo "📦 Creating database and user"
sudo -u postgres createdb $DB_NAME
sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';"

echo "🔐 Setting up database permissions"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '$POSTGRES_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
sudo -u postgres psql -d $DB_NAME -c "ALTER SCHEMA public OWNER TO $DB_USER;"
sudo -u postgres psql -c "ALTER DATABASE $DB_NAME OWNER TO $DB_USER;"

echo "⚙️ Adding database credentials to environment"
echo "POSTGRES_PRISMA_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME\"" >> ~/code/vibeflow/website/.env
echo "POSTGRES_URL_NON_POOLING=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME\"" >> ~/code/vibeflow/website/.env

echo "💾 Database credentials created successfully"
echo "-------------------------------------------"
echo "🔖 DATABASE CREDENTIALS - SAVE THESE SECURELY:"
echo "🔗 Database URL: postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
echo "👤 Admin password: $POSTGRES_PASSWORD"
echo "-------------------------------------------"

echo "🎉 Server setup completed successfully! 🎉"
echo "🔍 Please review any manual steps required above"
