# Backend Setup Instructions

## Prerequisites
Before you start, ensure you have Python installed on your system. You can download it from [python.org](https://www.python.org/downloads/).

## Installation

Follow these steps to set up your environment and start the server:

### 1. Platform-Specific Setup
**macOS**

1. Install Xcode Command Line Tools (if not already installed):
    ```
    xcode-select --install
    ```
2. Install MariaDB:
    ```
    brew install mariadb
    ```
3. Install OpenSSL (required for some Python packages):
    ```
    brew install openssl
    export LDFLAGS="-L$(brew --prefix openssl)/lib"
    export CPPFLAGS="-I$(brew --prefix openssl)/include"
    ```
4. Install MySQL client library:
    ```
    pip install mysqlclient
    ```

**Linux (Debian/Ubuntu)**
1. Install MariaDB development files:
    ```
    sudo apt-get install libmariadb-dev
    sudo apt install pkg-config
    ```
2. Install MySQL client library:
    ```
    pip install mysqlclient
    ```

### 2. Install Python dependencies
```
pip3 install -r requirement.txt
```

### 3. Environment Configuration
Make sure you add `db.env` into the `/myapp` folder. This file should contain all necessary environment variables for database configuration.

## Start the Server
Run the Django server
```
python3 manage.py runserver
```