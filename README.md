# Introduction

Welcome to the Task Manager project! This application provides a simple way to manage your tasks, similar to Trello. With it, you can create, delete, update, and view tasks and lists effortlessly.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Technologies](#technologies)
- [License](#license)

## Features

* **Create Lists**: Add new lists to organize your tasks.

* **View Lists**: See all your lists and the tasks within them.

* **Update Lists**: Rename or modify existing lists.

* **Delete Lists**: Remove lists you no longer need.

* **Create Cards**: Add new tasks to your lists.

* **View Cards**: View details of tasks and their current status.

* **Update Cards**: Edit task details, including title, description, and due dates.

* **Delete Cards**: Remove tasks that are completed or no longer relevant.

## Getting Started

To get started with the Task Manager, follow these steps:

1. **Clone the repository**

    ```
    git clone git@github.com:unzerstort/todo-list.git
    ```

2. **Navigate to the project directory**

    ```
    cd todo-list
    ```

3. **Install dependencies**

    ```
    npm install
    ```

4. **Start the database and run the project**

    ```
    rm -rf database.sqlite && npm start
    ```

5. **Run server**

    ```
    python3 -m http.server
    ```

## Usage

Once the application is running, you can interact with it through the user interface:

* **Create a New List**: Click on the "Add List" button and enter a name for your new list.

* **Add Tasks**: Within a list, click "Add Card" to create a new task. Fill in the details and save.

* **Edit Tasks or Lists**: You can modify the title of either tasks or lists.

* **Remove Tasks or Lists**: Use the delete buttons inside tasks or lists to remove them.

## Technologies

* **Front-end**: Vanilla JavaScript, CSS and HTML.
* **Back-end**: NodeJS and Express.
* **Database**: SQLite. 

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.