# Casino Web Application 🎰

Welcome to the Casino Web Application! This is a Flask-based web application designed for managing casino operations, including user registration, login, and game interface.
[![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://github.com/Naereen/badges/)[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)[![made-with-python](https://img.shields.io/badge/Made%20with-Python-1f425f.svg)](https://www.python.org/)[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
## Table of Contents 📑

- [Features](#features-)
- [Installation](#installation-)
- [Usage](#usage-)
- [Database Setup](#database-setup-)
- [Contributing](#contributing-)
- [License](#license-)

## Features ✨

- **User Registration and Login**: Secure and easy-to-use registration and login system.
- **Game Interface**: Interactive game interface for a seamless user experience.
- **Database Connection**: Robust connection to MySQL database.

## Installation 🛠

To get a local copy up and running, follow these simple steps:

### Prerequisites

- Python 3.6+
- MySQL

### Clone the Repository

```bash
git clone https://github.com/Caesarcph/Web_Blackjack_Game.git
cd Web_Blackjack_Game
```

### Create a Virtual Environment and Activate It

```bash
python3 -m venv venv
source venv/bin/activate
```

### Install Required Packages

```bash
pip install -r requirements.txt
```

### Set Up Environment Variables

Create a `.env` file in the project root directory and add your database configuration:

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DB=Casino
MYSQL_CURSORCLASS=DictCursor
```

## Database Setup 🗄

### Import the Database Structure and Data

Ensure MySQL is running and execute the following command to import the database structure and initial data:

```bash
mysql -u root -p Casino < database.sql
```

## Usage 🚀

### Run the Application

```bash
python app.py
```

Open your web browser and go to `http://127.0.0.1:5000`.

### Features

- **Register a New User**: Visit `http://127.0.0.1:5000/register` to create a new account.
- **Login**: Visit `http://127.0.0.1:5000/` to log in with your credentials.
- **Access the Game Interface**: After logging in, go to `http://127.0.0.1:5000/game` to start playing.

## Contributing 🤝

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
