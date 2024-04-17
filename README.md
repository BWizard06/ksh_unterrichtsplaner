# Projektname

Beschreiben Sie hier Ihr Projekt.

## Anforderungen

- Node.js
- npm

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
## Konfiguration
Aktualisieren Sie die .env.example Datei und benennen Sie sie in .env um. Aktualisieren Sie die Werte DATABASE_URL zu Ihrer eigenen MongoDB-URL und aktualisieren Sie das JWT_SECRET.

## Starten
```sh
npm run dev
```
Öffnen Sie http://localhost:3000, um das Projekt in Ihrem Browser zu sehen.