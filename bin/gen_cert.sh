openssl req -x509 -nodes -days 730 -newkey rsa:2048 \
 -keyout public/key.pem -out public/cert.pem -config req.cnf -sha256

