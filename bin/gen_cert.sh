echo "********************************"
echo "Enter localhost for common name."
echo "Leave other fields blank."
echo "********************************"
/c/Program\ Files/Git/usr/bin/openssl.exe              \
	req -x509 -nodes -days 3650 -sha256 -out cert.pem  \
	-newkey rsa:2048 -keyout key.pem 

