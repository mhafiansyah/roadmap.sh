# Task Tracker
sample solution for the [task-tracker](https://roadmap.sh/projects/task-tracker) challenge from [roadmap.sh](https://roadmap.sh).

this is a simple cli application for tracking tasks.

## Features
- batch add a new tasks with a unique id and store it in json format.
- batch mark tasks as `in-progress`, or `done`.
- batch delete tasks by their ID.
- list tasks based on their status, `[t]odo`, `in-[p]rogress`, `[d]one`.
- update the tasks description based on their id.
- find tasks based on their description.

## How to run
**Clone the repository**
```
git clone https://github.com/mhafiansyah/roadmap.sh.git
#Navigate to the project directory
cd backend/01-task-tracker
```

## Usage
```
#to add task
node index.js add "Make Coffee" "Exercise" "Do Homework"

#to list all task
node index.js list

#to list task marked as todo
node index.js list t
node index.js list todo

#to list task marked as in-progress
node index.js list p
node index.js list in-progress

#to list task marked as done
node index.js list d
node index.js list done

#to mark task as todo / in-progress / done
node index.js todo <id> <id> <id>
node index.js progress <id> <id> <id>
node index.js done <id> <id> <id>

#to delete task
node index.js del <id> <id> <id>
node index.js delete <id> <id> <id>

#to edit task
node index.js edit <id> "new task"

#to find task
node index.js find <id> "task"
node index.js search <id> "task"
```

## Example of how data is stored
```
{
  "ed53ae": {
    "task": "task 1",
    "status": "in-progress",
    "createdAt": "2026-02-15T14:11:37.585Z",
    "updatedAt": "2026-02-15T14:13:04.034Z"
  },
  "671dd2": {
    "task": "task 2",
    "status": "todo",
    "createdAt": "2026-02-15T14:11:37.585Z",
    "updatedAt": "2026-02-15T14:13:33.073Z"
  },
  "2d250e": {
    "task": "task 3",
    "status": "todo",
    "createdAt": "2026-02-15T14:11:37.585Z",
    "updatedAt": "2026-02-15T14:11:37.585Z"
  }
}
```

>Note: JSON file will automatically created on the application first run