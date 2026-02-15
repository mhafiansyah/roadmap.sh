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
        // create file with empty JSON if file doesn't exists
        await fs.writeFile(DB_URL, JSON.stringify({}, null, 2));
        console.log("Initialized new database.");
    }
}

const getTasks = async () => {
    const data = await fs.readFile(DB_URL, 'utf-8');
    // parse as JSON because currently it's a string
    return JSON.parse(data);
}

const saveTasks = async (tasks) => {
    // stringify new tasks to treat as normal string
    await fs.writeFile(DB_URL, JSON.stringify(tasks, null, 2));
}

const [,, command, ...args] = process.argv;

async function main() {
    try {
        await initDB();
        let tasks = await getTasks();

        switch (command.toLowerCase()) {
            case 'add':
                try{
                    const taskName = args.join(' ');
                    // use current date as key of object
                    tasks[Date.now()] = {task: taskName, status: 'todo'};
                    await saveTasks(tasks);
                    console.log('Tasks Added');
                } catch (err) {
                    console.error("🚀 ~ main ~ err:", err)
                }
                break;

            case 'list':
                let entries = Object.entries(tasks);
                // set userfilter based on user arguments, or use empty string if no argument is provided
                let userFilter = args[0] || '';
                if (userFilter.toLowerCase() === 'd' || userFilter.toLowerCase() === 'done') {
                    userFilter = 'done';
                } else if (userFilter.toLowerCase() === 'p' || userFilter.toLowerCase() === 'in-progress') {
                    userFilter = 'in-progress';
                } else if (userFilter.toLowerCase() === 't' || userFilter.toLowerCase() === 'todo') {
                    userFilter = 'todo';
                }

                // filter only if user provide arguments, empty string is equal to false, so the condition doesnt fulfill
                if (userFilter) {
                    entries = entries.filter(entry => entry[1].status === userFilter);
                }

                if (entries.length === 0) {
                    console.log('Your task list is empty');
                } else {
                    // make an array to use for console.table
                    const tableData = entries.map(([id, data]) => ({
                        id,
                        task: data.task,
                        status: data.status
                    }));
                    console.table(tableData);
                }
                break;

            case 'progress':
                try {
                    const progressID = args[0];
                    if (tasks[progressID]) {
                        tasks[progressID].status = 'in-progress';
                        await saveTasks(tasks);
                        console.log(`Task ${progressID} marked as in-progress.`);
                    } else {
                        console.log(`Task ${progressID} not found.`)
                    }
                } catch (err) {
                    console.error("🚀 ~ main ~ err:", err)
                }
                break;

            case 'done':
                try {
                    const doneID = args[0];
                    if (tasks[doneID]) {
                        tasks[doneID].status = 'done';
                        await saveTasks(tasks);
                        console.log(`Task ${doneID} marked as done.`);
                    } else {
                        console.log(`Task ${doneID} not found.`)
                    }
                } catch (err) {
                    console.error("🚀 ~ main ~ err:", err)
                }
                break;

            case 'delete':
                try {
                    const delID = args[0];
                    if (tasks[delID]) {
                        delete tasks[delID];
                        await saveTasks(tasks);
                        console.log(`Task ${delID} removed.`)
                    } else {
                        console.log(`Task ${delID} not found.`)
                    }
                } catch (err) {
                    console.error("🚀 ~ main ~ err:", err)
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