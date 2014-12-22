apt-get update && apt-get upgrade -y
apt-get install libxss1 libappindicator1 libindicator7 xdg-utils libpango1.0-0 libnss3 libnspr4 libgconf-2-4 libasound2 gconf-service gconf-service-backend libasound2-data gconf2-common libnss3-nssdb libpangoxft-1.0-0 libpangox-1.0-0 libxft2 make build-essential openssl libssl-dev pkg-config git-core monit Xvfb

wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome*.deb

wget http://nodejs.org/dist/v0.10.33/node-v0.10.33.tar.gz
tar xvf node-v0.10.33.tar.gz
cd node-v0.10.33 && make && make install

adduser --disabled-password --gecos "" node
usermod -L node

git clone https://github.com/jcblw/cray-filters.git