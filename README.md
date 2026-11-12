# React + Laravel Project

An application for managing projects and tasks. The frontend is built with React, TypeScript, and Vite; the API uses Laravel and SQLite.

## Requirements

Install the following before getting started:

- [Git](https://git-scm.com/)
- [PHP 8.3 or later](https://www.php.net/) and [Composer](https://getcomposer.org/)
- [Node.js 20.19+ or 22.12+](https://nodejs.org/) (includes npm)

## 1. Clone the project

Open a terminal in the folder where you want to save the project and run:

```bash
git clone https://github.com/Jpscosta02/main.git
cd main
```

The following commands assume you are in the `main` folder (the project root).

## 2. Install and configure the backend

```bash
cd backend
composer install
```

Create the local `.env` configuration file from the example:

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux**

```bash
cp .env.example .env
```

Then, still inside `backend`, generate the application key and prepare the database:

```bash
php artisan key:generate
php artisan migrate
```

The project uses SQLite, so you do not need to install or configure a MySQL server. If `database/database.sqlite` does not exist, create an empty file with that name inside the `backend/database` folder before running `php artisan migrate`.

## 3. Install the frontend

Return to the project root and install the dependencies:

```bash
cd ..
cd frontend
npm install
```

## 4. Run the application

You need **two terminals**. Keep both open while using the application.

In the first terminal, from the project root, start the API:

```bash
cd backend
php artisan serve
```

In the second terminal, also from the project root, start the frontend:

```bash
cd frontend
npm run dev
```

Open the address shown by Vite in your browser, usually <http://localhost:5173>. The frontend forwards API requests to Laravel, which runs at <http://127.0.0.1:8000> by default.

## Common issues

- **`php`, `composer`, or `npm` is not recognized:** make sure the tool is installed and restart your terminal.
- **The application cannot load projects or tasks:** make sure both terminals are still running and that `php artisan migrate` completed without errors.
- **The port is already in use:** close the application using it or use the alternative address shown in the terminal.
