# Orbital-2022

## Useful Links

1. [Slides](https://docs.google.com/presentation/d/1PXVB1DNFFnMkANEhdsW63MLoBH-GiuCpxfK8Pb9J-Jk/edit)
2. [Website](http://orbital22.nusgreyhats.org/) (Will be up during the workshop)


# Quick Start Guide

1. Make sure [docker](https://www.docker.com/products/docker-desktop/) is installed and running
2. Clone the file into you directory
3. Run `docker-compose up`
4. The program should be running on [`localhost:3000`](https://localhost:3000)

## Vulnerabilities on the website

1. Dom based xss in view notes search
2. Command injection in report bug
3. SQLi in login page
4. Information leak on individual notes
5. Stored XSS in notes


# Other useful links

### XSS

1. [XSS by PortSwigger](https://portswigger.net/web-security/cross-site-scripting)
1. [XSS by OWASP](https://owasp.org/www-community/attacks/xss/)

### CSRF

1. [CSRF by PortSwigger](https://portswigger.net/web-security/csrf)
1. [CSRF by OWASP](https://owasp.org/www-community/attacks/csrf)

### SQLi

1. [SQLi by PortSwigger](https://portswigger.net/web-security/sql-injection)
1. [SQLi by OWASP](https://owasp.org/www-community/attacks/SQL_Injection)

### XSS With CSRF Token
1. [XSS With CSRF Token](https://www.doyler.net/security-not-included/xss-attack-chain)

### Other Vulnerabilities not covered in this workshop

1. [Local File Inclusion](https://www.offensive-security.com/metasploit-unleashed/file-inclusion-vulnerabilities)
1. [Template injection](https://portswigger.net/research/server-side-template-injection)

### Other Vulnerable Web App

1. [DVWA](https://dvwa.co.uk/)
1. [OWASP Top 10](https://application.security/free/owasp-top-10)