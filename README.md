# Task Management Application
A modern task management application built with Laravel and Vue Starter kit

## Features
-  Task creation and management
-  Team collaboration
-  User authentication and authorization
-  Task tracking and status updates
-  Priority management
-  Audit trails (created_by, updated_by tracking)

## Tech Stack
- **Laravel Spatie Permission** - Role and permission management
- **Laravel Reverb** - Real-time WebSocket communication
- **Laravel Wayfinder** - Navigation and menu management
- **Shadcn Vue** - UI component library
- **Lucide Vue** - Icon library

## Requirements
- PHP 8.1 or higher
- Composer
- MySQL 8.0 or higher
- Node.js 18+ and npm (for frontend assets)

## Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/task-management-app.git
cd task-management-app
```

2. Install PHP dependencies
```bash
composer install
```

3. Install Node dependencies
```bash
npm install
```

4. Copy the environment file
```bash
cp .env.example .env
```

5. Generate application key
```bash
php artisan key:generate
```

6. Configure your database in `.env`
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=task_management
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

7. Run migrations
```bash
php artisan migrate
```

8. (Optional) Seed the database
```bash
php artisan db:seed
```

9. Build frontend assets
```bash
npm run dev
```

10. Start the development server
```bash
php artisan serve
```

Visit `http://localhost:8000` in your browser.

## License
This project is licensed under the MIT License.
