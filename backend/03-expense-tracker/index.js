import { readFile, writeFile, access} from 'node:fs/promises';
import { URL } from 'node:url';
import { parseArgs } from 'node:util';
import crypto from 'node:crypto';

const DB_FILE = new URL ('./expenses.json', import.meta.url);

const argsConfig = {
    allowPositionals: true,
    strict: false,
    options: {
        desc: {
            type: 'string',
            short: 'd',
        },
        amount: {
            type: 'string',
            short: 'a',
        },
        id: {
            type: 'string'
        },
        month: {
            type: 'string',
            short: 'm',
        }
    },
};

async function init() {
    try {
        await access(DB_FILE);
    } catch (err) {
        await writeFile(DB_FILE, JSON.stringify({}, null, 2));
        console.log('Initialized new database.');
    }
}

async function getExpenses() {
    try {
        const expenses = await readFile(DB_FILE, 'utf-8');
        return JSON.parse(expenses);
    } catch (err) {
        console.log(`error on reading expenses data: ${err}`);
    }
}

async function saveExpenses(expenses) {
    try {
        await writeFile(DB_FILE, JSON.stringify(expenses, null, 2));
    } catch (err) {
        console.error(`Error while trying to write expenses: ${err}`);
    }
}

function generateID(length = 6) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

function filterByMonth(item, filterDate) {
    let formattedDate;
    const monthName = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    if (monthName.includes(filterDate)) {
        const monthIndex = monthName.indexOf(filterDate) + 1;
        formattedDate = String(monthIndex).padStart(2, '0');
    } else {
        formattedDate = String(filterDate).padStart(2, '0');
    }
    
    const itemDate = item['createdAt'];
    const month = itemDate.slice(5, 7);
    if (month === formattedDate) return true;
    else return false
}

function isNegative(amount) {
    if (typeof amount !== 'number' || Number.isNaN(amount)) {
        return false;
    }

    return amount < 0;
}

async function main() {
    init();
    let expenses = await getExpenses();

    try {
        const { values, positionals } = parseArgs(argsConfig);
        const now = new Date().toISOString();
        const userAction = positionals[0];
        switch (userAction?.toLowerCase()) {
            case 'add':
                const addDesc = values['desc'];
                const addAmount = parseFloat(values['amount']);

                if (!addDesc) { console.log("Please add description"); break; }
                if (!addAmount) { console.log("Please add amount"); break; }
                if (isNegative(addAmount)) { console.log("Amount cannot be negative"); break; }

                let id = generateID();
                while(expenses[id]) { id = generateID(); }
                expenses[id] = {
                    desc: addDesc,
                    amount: addAmount,
                    createdAt: now,
                    updatedAt: now
                }
                await saveExpenses(expenses);
                console.log(`${addDesc} (ID:${id}) expenses added successfully.`);
                break;
            
            case 'list':
                const tableData = Object.entries(expenses)
                    .map(([id, data]) => ({
                        ID: id,
                        Description: data.desc,
                        Amount: data.amount,
                        Created: data.createdAt.split('T')[0],
                        Updated: data.updatedAt.split('T')[0]
                    }))

                if (tableData.length === 0) {
                    console.log('No expenses found.')
                } else {
                    console.table(tableData);
                }
                break;

            case 'update':
            case 'edit':
                const editID = values['id'];
                if (!editID) {
                    console.log('Please provide expenses id to edit.');
                    break;
                }

                if (!expenses[editID]) {
                    console.log(`${editID} not found.`);
                    break;
                }
                
                const editDesc = values['desc'] || expenses[editID].desc;
                const editAmount = parseFloat(values['amount']) || expenses[editID].amount;
                if (isNegative(editAmount)) {
                    console.log("Amount cannot be negative");
                    break;
                }

                expenses[editID].desc = editDesc;
                expenses[editID].amount = editAmount;
                expenses[editID].updatedAt = new Date().toISOString();
                await saveExpenses(expenses);
                console.log(`Expenses ${editID} edited successfully.`);
                break;
        
            case 'delete':
            case 'del':
                const delID = values['id'];
                if (!delID) {
                    console.log('Please provide expenses id to delete.');
                    break;
                }

                if (!expenses[delID]) {
                    console.log(`${delID} not found.`)
                }

                delete expenses[delID];
                await saveExpenses(expenses);
                console.log(`Expenses ${delID} deleted successfully.`)
                break;
            

            case 'summary':
                const monthFilter = values['month'];
                const summary = Object.values(expenses)
                    .filter((item) => {
                        if (monthFilter) return filterByMonth(item, monthFilter);
                        else return true
                    })
                    // Object.values(expenses) will results in something like
                    // [
                    //   { desc: 'food', amount: 10 },
                    // ]
                    // { amount } is destructuring to get amount value 
                    .reduce((acc, { amount }) => {                        
                        return acc + amount;
                    }, 0);
                console.log(`Total Expenses: $${Math.round(summary * 100) / 100}`);
                break;
                
            default:
                console.log('no action');
                break;
        }
    } catch (err) {
    console.error("🚀 ~ main ~ err:", err)
    }
}

main();