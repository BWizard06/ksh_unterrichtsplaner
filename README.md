# KSH-Unterrichtsplaner

## Anforderungen

- Node.js
- npm

## Konfiguration

Aktualisieren Sie die .env.example Datei und benennen Sie sie in .env um. Aktualisieren Sie die Werte DATABASE_URL zu Ihrer eigenen [MongoDB Atlas URL](https://account.mongodb.com/account/login?n=https://cloud.mongodb.com/v2/640888ab23702e38ed54454e&nextHash=%23clusters&signedOut=true) und aktualisieren Sie das JWT_SECRET.

## Installation

1. Klonen Sie das Repository:

```sh
git clone https://github.com/BWizard06/ksh_unterrichtsplaner.git
```
2. Installieren Sie die Abhängigkeiten:
```sh
cd <repository-name>
npm install
```
3. Installieren Sie Prisma:
```sh
npm install -g prisma
```
4. Pushen Sie das Prisma-Model in die Datenbank:
```sh
npx prisma db push
```
5. Generieren Sie den Prisma-Client:
```sh
npx prisma generate
```

## Starten
```sh
npm run dev
```
Öffnen Sie http://localhost:3000, um das Projekt in Ihrem Browser zu sehen.
