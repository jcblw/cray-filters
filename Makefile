default:
	apt-get install libxss1 libappindicator1 libindicator7
	wget https://dl.google.com/linux/direct/google-chrome-stable_current_i386.deb
	dpkg -i google-chrome*.deb
