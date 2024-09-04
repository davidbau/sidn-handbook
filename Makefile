.PHONY: all clean

all:
	  cd src && python3 build.py

clean:
	  rm -rf public
