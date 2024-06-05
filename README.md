# Polynomial Client

## Table of Contents

-   [Introduction](#introduction)
-   [Key Features](#key-features)
-   [System Requirements](#system-requirements)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Known Issues](#known-issues)
-   [Future Enhancements](#future-enhancements)
-   [Contributing](#contributing)

## Introduction

Polynomial is a project management tool designed to streamline team collaboration and task management localized all on
discord. The front-end system is built using React and integrates with Discord for user authentication and
notifications. It provides a real-time dashboard for project status updates, task views, and team member management.
Polynomial is ideal for remote teams working on multiple projects simultaneously, offering a centralized platform for
tracking progress and deadlines.

## Key Features

-   **Project Management:** Create and manage multiple projects effortlessly.
-   **Team Member Management:** Add or remove team members using the UI or Discord roles.
-   **Real-Time Dashboard:** View project status, progress bars, assigned members, and deadlines during group calls.
-   **Task Views:** Access card and stacked list views of tasks with drag-and-drop functionality and real-time updates.
-   **Notifications:** Receive updates about task progress directly in the designated Discord channel.

## System Requirements

-   **Node.js**
-   **pnpm**
-   **Discord:** Account and server for integration

## Installation

To set up the front-end system locally, follow these steps:

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/polynomial115/polynomial-client.git
    cd polynomial-frontend
    ```

2. **Install Dependencies:**

    ```bash
    pnpm install
    ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following:

    ```env
    VITE_DISCORD_CLIENT_ID=your_discord_client_id
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_firebase_app_id
    ```

4. **Run the Application:**

    ```bash
    pnpm dev
    ```

5. **Open in Discord:**
   Navigate to the Discord server check "Use Activity URL Override" then click on the activity.

## Usage

### Project Management

-   **Create a Project:** Navigate to the project section and click "Create New Project." Fill in the project details and
    save.
-   **View Projects:** View a list of all projects and select any project to view its details.

### Team Member Management

-   **Add Team Members:** Go to the team management section, select the project, and add members from the user list.
-   **Remove Team Members:** Select a team member from the list and remove them from the project.

### Real-Time Dashboard

-   **Access Dashboard:** During a group call, access the dashboard to view real-time updates on tasks, including progress
    bars and deadlines.
-   **Update Tasks:** Click on a task to view details and update the status, which reflects immediately on the dashboard.

### Task Views

-   **Card View:** Drag and drop tasks to update their status or reorder them by priority.
-   **Stacked List View:** Sort and filter tasks by different criteria, with users not on the call shown at the bottom.

### Notifications

-   **Receive Notifications:** Get notifications in the designated Discord channel when tasks are updated, started, or
    completed.

## Known Issues

-   Task sorting may not function correctly under certain conditions.
-   Missing functionality for advanced filtering in the task list view.
-   Hard-coded data for initial project setup.

## Future Enhancements

-   Implement advanced filtering options for task lists.
-   Develop a comprehensive notification system for task updates and milestones.
-   Integrate a Gantt calendar view for visualizing project timelines.

## Contributing

We welcome contributions to enhance the functionality and usability of the Polynomial project. Please follow these
steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.
