init: init-submodule init-client


init-submodule:
	git submodule update --init --recursive

init-client:
	cd client && sh ./bin/init.sh
