# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at `src/app/page.tsx`.

---

## Publishing to GitHub

To upload your project to GitHub, follow these steps.

### 1. Create a New Repository on GitHub

First, go to [GitHub.com](https://github.com) and create a new repository.

*   Click the **+** icon in the top-right corner and select **"New repository"**.
*   Give your repository a name (e.g., `barbuddy-v5`).
*   **Important:** Do **not** initialize the new repository with a `README` or `.gitignore` file, as this project already contains them.
*   Click **"Create repository"**.

### 2. Connect Your Project and Upload Files

After creating the repository, GitHub will show you a page with commands. You can follow those, or use the commands below.

Open a terminal in your project's **root directory** (the main folder containing `package.json`) and run the following commands one by one:

1.  **Initialize Git (if you haven't already):**
    ```bash
    git init -b main
    ```

2.  **Add all your project files to be tracked:**
    ```bash
    git add .
    ```

3.  **Create your first commit (a snapshot of your code):**
    ```bash
    git commit -m "Initial commit"
    ```

4.  **Connect your local project to the repository on GitHub.**
    ```bash
    git remote add origin https://github.com/koppersvette1/V5-BarBuddy.git
    ```

5.  **Push your code up to GitHub:**
    ```bash
    git push -u origin main
    ```

After running these commands, your entire project will be uploaded and visible in your GitHub repository.
