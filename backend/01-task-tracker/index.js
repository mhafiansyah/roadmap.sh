import process from 'node:process';
import fs from 'node:fs/promises';
import { URL } from 'node:url';

// workaround for __dirname doesnt exists in module type nodejs

const DB_URL = new URL ('./tasks.json', import.meta.url);

const initDB = async () => {
    try {
        // check if file exists
        await fs.access(DB_URL);
    } catch (err) {
        // create file with empty array if file doesn't exists
        await fs.writeFile(DB_URL, JSON.stringify([], null, 2));
        console.log("Initialized new database.");
    }
}

const getTasks = async () => {
    const data = await fs.readFile(DB_URL, 'utf-8');
    // return as JSON so it can be read easily
    return JSON.parse(data);
}

const saveTasks = async (tasks) => {
    // add new tasks as normal string instead of JSON data type
    await fs.writeFile(DB_URL, JSON.stringify(tasks, null, 2));
}

const tasksStatusUpdate = async (id, tasks, status) => {
    const taskID = parseInt(id);
    tasks = tasks.map(t => t.id === taskID ? {...t, status: status} : t);
    await saveTasks(tasks);
}

const [,, command, ...args] = process.argv;

async function main() {
    try {
        await initDB();
        let tasks = await getTasks();

        switch (command.toLowerCase()) {
            case 'add':
                const taskName = args.join(' ');
                tasks.push({ id: Date.now(), task: taskName, status: 'todo' });
                await saveTasks(tasks);
                console.log('Tasks Added');
                break;

            case 'list':
                if (tasks.length === 0) {
                    console.log('Your tasks list is empty');
                } else {
                    const status = args[0] || '';
                    if (status.toLowerCase() === 'in-progress' || status.toLowerCase() === 'p') {
                        tasks = tasks.filter(t => t.status === 'in-progress');
                    }
                    else if (status.toLowerCase() === 'done' || status.toLowerCase() === 'd') {
                        tasks = tasks.filter(t => t.status === 'done');
                    }
                    else if (status.toLowerCase() === 'todo' || status.toLowerCase() === 't') {
                        tasks = tasks.filter(t => t.status === 'todo');
                    }
                    console.table(tasks);
                }
                break;

            case 'progress':
                try {
                    const progressID = args[0];
                    await tasksStatusUpdate(progressID, tasks, 'in-progress');
                    console.log(`Tasks ${progressID} marked as in-progress`);
                } catch (err) {
                    console.error(`error on progress, ${err}`);
                }
                break;

            case 'done':
                try {
                    const doneID = args[0];
                    await tasksStatusUpdate(doneID, tasks, 'done');
                    console.log(`Tasks ${doneID} marked as done!`)
                } catch (err) {
                    console.error(`error on done, ${err}`);
                }

                break;

            case 'delete':
                const delID = parseInt(args[0]);
                const initialLength = delID.length;

                tasks = tasks.filter(task => task.id !== delID);

                if (tasks.length = initialLength) {
                    console.log(`Could not find task with ID ${delID}`);
                } else {
                    await saveTasks(tasks);
                    console.log(`Task ID ${delID} deleted`);
                }
                break;

            default:
                console.log('nothing');
                break;
        }
    } catch (err) {
        console.error("Error:", err.message);
    }

    
}


main();