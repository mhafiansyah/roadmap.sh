import process from 'node:process';
import fs from 'node:fs/promises';
import { URL } from 'node:url';
import crypto from 'node:crypto';

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

const generateID = (length = 6) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

const [,, command, ...args] = process.argv;

async function main() {
    try {
        await initDB();
        let tasks = await getTasks();
        const now = new Date().toISOString();

        switch (command?.toLowerCase()) {
            case 'add':
                try {
                    const input = args.join(' ');
                    if (!input) return console.log('No tasks provided');
                    
                    args.forEach((taskName) => {
                        let id = generateID();
                        while(tasks[id]) { id = generateID(); }

                        tasks[id] = {
                            task: taskName,
                            status: 'todo',
                            createdAt: now,
                            updatedAt: now
                        };
                    });
                    await saveTasks(tasks);
                    console.log('Tasks Added');
                } catch (err) {
                    console.error("🚀 ~ main ~ err:", err)
                }
                break;

            case 'list':
                const filterArg = args[0]?.toLowerCase();
                const entries = Object.entries(tasks);

                if (entries.length === 0) {
                    console.log('Your task list is empty');
                    break;
                }
                // need to wrap JSON in (parantheses) otherwise it will be treated as a function code block which will give an error if written without return
                // () => { ... } → Expects code and a return keyword.
                // () => ({ ... }) → Automatically returns the object inside.
                const tableData = entries
                    .map(([id, data]) => ({
                        id,
                        task: data.task,
                        status: data.status,
                        created: data.createdAt.split('.')[0].replace('T','@'),
                        updated: data.updatedAt.split('.')[0].replace('T','@')
                    }))
                    .filter((item) => {
                        if (filterArg === 'done' || filterArg === 'd') return item.status === 'done';
                        else if (filterArg === 'in-progress' || filterArg === 'p') return item.status === 'in-progress';
                        else if (filterArg === 'todo' || filterArg === 't') return item.status === 'todo';
                        else return true; // return all item if there is no filter
                    });
                
                if (tableData.length === 0) {
                    console.log(`No tasks found for filter ${filterArg}`);
                } else {
                    console.table(tableData);   
                }             
                break;

            case 'todo':
                try {
                    let todoCount = 0;
                    args.forEach((todoID) => {
                        if (tasks[todoID]) {
                            tasks[todoID].status = 'todo';
                            tasks[todoID].updatedAt = now;
                            todoCount++;
                            console.log(`Task ${todoID} marked as todo.`);
                        } else {
                            console.log(`Task ${todoID} not found.`)
                        }
                    });

                    if (todoCount > 0) {
                        await saveTasks(tasks);
                        console.log(`successfully marked ${todoCount} as todo`);
                    }
                } catch (err) {
                    console.error("🚀 ~ main ~ err:", err)
                }
                break;
            
            case 'progress':
                try {
                    let progressCount = 0;
                    args.forEach((progressID) => {
                        if (tasks[progressID]) {
                            tasks[progressID].status = 'in-progress';
                            tasks[progressID].updatedAt = now;
                            progressCount++;
                            console.log(`Task ${progressID} marked as in-progress.`);
                        } else {
                            console.log(`Task ${progressID} not found.`)
                        }
                    });

                    if (progressCount > 0) {
                        await saveTasks(tasks);
                        console.log(`successfully marked ${progressCount} as in-progress`);
                    }
                } catch (err) {
                    console.error("🚀 ~ main ~ err:", err)
                }
                break;

            case 'done':
                try {
                    let doneCount = 0;
                    args.forEach((doneID) => {
                        if (tasks[doneID]) {
                            tasks[doneID].status = 'done';
                            tasks[doneID].updatedAt = now;
                            doneCount++;
                            console.log(`Task ${doneID} marked as done.`);
                        } else {
                            console.log(`Task ${doneID} not found.`)
                        }
                    });

                    if (doneCount > 0) {
                        await saveTasks(tasks);
                        console.log(`successfuly marked ${doneCount} tasks as done`);
                    }
                } catch (err) {
                    console.error("🚀 ~ main ~ err:", err)
                }
                break;
            
            case 'del':
            case 'delete':
                try {
                    args.forEach((delID) => {
                        if (tasks[delID]) {
                            delete tasks[delID];
                            console.log(`Task ${delID} removed.`)
                        } else {
                            console.log(`Task ${delID} not found.`)
                        }
                    });
                    await saveTasks(tasks);
                } catch (err) {
                    console.error("🚀 ~ main ~ err:", err)
                }
                break;

            case 'find':
            case 'search':
                const query = args.join(' ').toLowerCase();
                if (!query) return console.log('Please provide a search term.')

                const results = Object.entries(tasks)
                    .filter(([_, data]) => data.task.toLowerCase().includes(query))
                    .map(([id, data]) => ({
                        id,
                        task: data.task,
                        status: data.status,
                        created: data.createdAt.split('.')[0].replace('T','@'),
                        updated: data.updatedAt.split('.')[0].replace('T','@')
                    }))
                
                if (results.length === 0) {
                    console.log(`No tasks found matching: ${query}`);
                } else {
                    console.log(`Search results for ${query}`);
                    console.table(results);
                }
                break;
            
            case 'edit':
                try {
                    const editID = args[0];
                    const newDesc = args.slice(1).join(' ').trim();

                    if (!editID || !newDesc) {
                        console.log('Usage: node task.js edit <id> <new description></new>');
                        break;
                    }

                    if (tasks[editID]) {
                        const oldDesc = tasks[editID].task;
                        tasks[editID].task = newDesc;
                        tasks[editID].updatedAt = new Date().toISOString();

                        await saveTasks(tasks);
                        console.log(`${editID} task updated.`);
                        console.log(`From: ${oldDesc}`);
                        console.log(`To: ${newDesc}`);
                    }
                } catch (err) {
                    console.error("🚀 ~ main ~ err:", err)
                }
                
                break;

            default:
                console.log('Commands: add <"task">, list [p/d/t], progress <id...>, done <id...>, delete/del <id...>, find/search <query> edit <id> <"task">');
                break;
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
}


main();