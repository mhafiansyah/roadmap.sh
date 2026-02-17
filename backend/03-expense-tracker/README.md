# CLI Expenses Tracker
sample solution for the [Expenses Tracker](https://roadmap.sh/projects/expense-tracker) challenge from [roadmap.sh](https://roadmap.sh).

this is a simple cli application for tracking user expenses.

## Features
- add, edit, delete, and list expenses
- summary of all expenses, or filter by month 

## How to run
**Clone the repository**
```
git clone https://github.com/mhafiansyah/roadmap.sh.git

#Navigate to the project directory
cd backend/03-expense-tracker
```

## Usage
```
# add new expenses
node index.js add --desc "Lunch" --amount 100
node index.js add -d "Lunch" -a 100

# list all expenses
node index.js list

# edit expenses
node index.js edit --id <id> --desc <string> --amount <number>
node index.js update --id <id> --desc <string> --amount <number>

# delete expenses
node index.js del --id <id>
node index.js delete --id <id>

# expenses summary
node index.js summary
node index.js summary --month 2
node index.js summary -m 2
```