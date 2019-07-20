import { createStore, combineReducers } from 'redux';
import uuid from 'uuid';

//ACtions
//Add_expnese //action generator
const addExpense = (
    { 
        description='',
        note='', 
        amount = 0, 
        createdAt = 0
    } = {}
) => ({
    type: 'ADD_EXPENSE',
    expense: {
        id: uuid(),
        description,
        note,
        amount,
        createdAt
    }
});

//remove_expense
const removeExpense = ( {id} = {} ) => ({
    type: 'REMOVE_EXPENSE',
    id //should go to action object to be called in reducer
});

//edit_expense
const editExpense= (id, updates) => ({
    type: 'EDIT_EXPENSE',
    id,
    updates
});

//set_text_filter
const setTextFilter = (text='') => ({
    type: 'SET_TEXT_FILTER',
    text
});

//sort_by_date
const sortByDate = () => ({
    type: 'SORT_BY_DATE'
});

//sort_by_amount
const sortByAmount = () => ({
    type: 'SORT_BY_AMOUNT'
});

//set_start_date
const setStartDate = (startDate) => ({
    type: 'SET_START_DATE',
    startDate
});

//set_end_date
const setEndDate = (endDate) => ({
    type: 'SET_END_DATE',
    endDate
});

//expenses reducer
const expensesReducerDefaultState = [];
const expensesReducer =(state = expensesReducerDefaultState, action) => {
    switch (action.type){
        case 'ADD_EXPENSE':
            return[
                ...state, //spread operator
                action.expense
            ];
        case 'REMOVE_EXPENSE':
            return state.filter(({id}) => { //returns new array with the subsets value
                return id !== action.id;
            });
        case 'EDIT_EXPENSE':
            // return state.map - allow us to go to every single item with conditional logic
            return state.map ((expense) => {
                if (expense.id === action.id) {
                    return {
                        ...expense,
                        ...action.updates
                    };
                } else {
                    return expense;
                }
            });
        default: 
        return state;
    }
};

//filters reducer
const filtersReducerDefaultState = {
    text: '',
    sortBy: 'date',
    startDate: undefined,
    endDate: undefined
};

const filtersReducer = (state = filtersReducerDefaultState, action) => {
    switch(action.type){
        case 'SET_TEXT_FILTER':
        //return new object
        return {
            //grabb all values from current filter object
            ...state,
            //override text by setting text equal to
            text: action.text
        };
        case 'SORT_BY_AMOUNT':
        return {
            ...state,
            sortBy:'amount'
        };
        case 'SORT_BY_DATE':
        return {
            ...state,
            sortBy:'date'
        };
        case 'SET_START_DATE':
        return {
            ...state,
            startDate: action.startDate
        };
        default:
        case 'SET_END_DATE':
        return {
            ...state,
            endDate: action.endDate
        };
        return state;
    }
};

//timestamps

//get visibile expenses
const getVisibleExpenses = (expenses, {text, sortBy, startDate, endDate}) => {
    return expenses.filter((expense) => {
        const startDateMatch = typeof startDate !== 'number' || expense.createdAt >= startDate;
        const endDateMatch = typeof endDate !== 'number' || expense.createdAt <= endDate;
        const textMatch = expense.description.toLowerCase().includes(text.toLowerCase());

        return startDateMatch && endDateMatch && textMatch;
    }).sort((a, b) => {
        if (sortBy === 'date'){
            return a.createdAt < b.createdAt ? 1 : -1;
        }
        else if (sortBy === 'amount'){
            return b.amount > a.amount ? 1 : -1;
        }
    });
};

//store create
const store = createStore(
    combineReducers({
        expenses: expensesReducer,
        filters: filtersReducer
    })
);

store.subscribe(() => {
    const state = store.getState();
    const visibleExpenses = getVisibleExpenses(state.expenses, state.filters);
    console.log(visibleExpenses);
});

const expenseOne = store.dispatch(addExpense({description: 'Rent', amount: 100, createdAt: -211000}));
const expenseTwo = store.dispatch(addExpense({description: 'Coffee', amount: 300, createdAt: 1000}));


// store.dispatch(removeExpense({id: expenseOne.expense.id}));
// store.dispatch(editExpense(expenseTwo.expense.id, { amount: 20}));

//store.dispatch(setTextFilter('rent'));
// store.dispatch(setTextFilter());

store.dispatch(sortByAmount());
// store.dispatch(sortByDate());

//store.dispatch(setStartDate(125));
// store.dispatch(setStartDate());
//store.dispatch(setEndDate(1025));

const user = {
    name: 'Jen',
    age: 24
};

// console.log({
//     ...user,
//     Location: 'Iligan'
// });