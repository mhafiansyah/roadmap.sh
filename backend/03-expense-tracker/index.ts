import { parseArgs } from 'node:util';
import { getExpenses, saveExpenses } from './storage.js';
import * as service from './expenses.service.js';

const config = {
    allowPositionals: true,
    options: {
        desc: { type: 'string', short: 'd' },
        amount: { type: 'string', short: 'a' },
        id: { type: 'string' },
        month: { type: 'string', short: 'm' },
    }
} as const;

const main = async() => {
    const { values, positionals } = parseArgs(config);
	const action = positionals[0]?.toLowerCase();
	const expenses = await getExpenses();
	const now = new Date().toISOString();

    switch (action) {
        case 'add' : {
            const { desc, amount } = values;
			if (desc == undefined) return console.error('Error: missing description (--desc)');
			if (amount === undefined) return console.error('Error: missing amount (--amount)');

			const numAmount = parseFloat(amount);
			if (service.isInvalidAmount(numAmount)) return console.error('Error: amount must be a positive number');
			
			let id = service.generateID();
			while (expenses[id]) { id = service.generateID() };
			const update = {
				...expenses,
				[id]: { desc, amount: numAmount, createdAt: now, updatedAt: now }
			}

			await saveExpenses(update);
			console.log(`Expenses Added (${id})`);
            break;
        }

		case 'list': {
			const data = service.formatForTable(expenses);
			data.length ? console.table(data) : console.log('No expenses recorded');
			break;
		}

		case 'edit': {
			const { id } = values;
			if (!id || !expenses[id]) {
				console.error(`Expenses ID "${id}" not found.`);
				break;
			}

			const desc = values['desc'] ?? expenses[id].desc;
			const amount = values['amount'] as string ?? expenses[id].amount;

			if (service.isInvalidAmount(amount)) {
				console.error('Error: amount must be a positive number');
				break;
			}

			expenses[id] = {
				...expenses[id],
				desc,
				amount: parseFloat(amount),
				updatedAt: now
			}

			await saveExpenses(expenses);
			console.log(`Expenses ${id} updated.`)
			break;
		}

		case 'delete': {
			const { id } = values;
			if (!id || !expenses[id]) {
				console.error(`Expense ID "${id}" not found.`);
				break;
			}
			
			// this is called Object Destructuring with Rest Syntax
			// Example Data
			// const expenses = {
			// 	"1": { desc: "Coffee", amount: 5 },
			// 	"2": { desc: "Lunch", amount: 15 }
			// };
			// Result if we gave id value of 1:
			// javascript will give for that specific property in the object based on id
			// id = 1
			// _ = { desc: "Coffee", amount: 5 }
			// remaining = { "2": { desc: "Lunch", amount: 15 } }
			// the rest operator (...remaining) will collect all the data that were not explicitly named
			const { [id]: _, ...remaining } = expenses;
			await saveExpenses(remaining);
			console.log(`Expense ID ${id} deleted.`)
			break;
		}

		case 'summary': {
			const { month } = values;

			const total = Object.values(expenses)
				.filter((item) => month ? service.filterByMonth(item, month) : true)
				.map((item) => item.amount)
				.reduce((acc, curr) => acc + curr, 0)

			console.log(`Total Expense: ${total.toFixed(2)}`);
			break;
		}

        default: {
            console.log('Usage: add -d <msg> -a <num> | list | summary [-m <val>] | edit [--desc <msg>] [-a <val>] | delete --id <id>');
            break;
        }
    }
}

main().catch((err: unknown) => console.log(`System Error: ${err}`))