import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Expense data
    categories: [],
    transaction: [],
    
    // Income data
    incomeCategories: [],
    incomeTransactions: []
}

export const financialSlice = createSlice({
    name: 'financial',
    initialState,
    reducers: {
        // Expense reducers
        getTransactions: (state) => {
            // get expense transactions code
        },
        
        // Income reducers
        getIncomeTransactions: (state) => {
            // get income transactions code
        },
        
        // Set income data
        setIncomeCategories: (state, action) => {
            state.incomeCategories = action.payload;
        },
        
        setIncomeTransactions: (state, action) => {
            state.incomeTransactions = action.payload;
        },
        
        // Add new income transaction
        addIncomeTransaction: (state, action) => {
            state.incomeTransactions.push(action.payload);
        },
        
        // Update income transaction
        updateIncomeTransaction: (state, action) => {
            const { _id, ...updatedData } = action.payload;
            const index = state.incomeTransactions.findIndex(transaction => transaction._id === _id);
            
            if (index !== -1) {
                state.incomeTransactions[index] = { ...state.incomeTransactions[index], ...updatedData };
            }
        },
        
        // Delete income transaction
        deleteIncomeTransaction: (state, action) => {
            const { _id } = action.payload;
            state.incomeTransactions = state.incomeTransactions.filter(
                transaction => transaction._id !== _id
            );
        }
    }
})

// Export all actions
export const { 
    // Expense actions
    getTransactions, 
    
    // Income actions
    getIncomeTransactions, 
    setIncomeCategories,
    setIncomeTransactions,
    addIncomeTransaction,
    updateIncomeTransaction,
    deleteIncomeTransaction
} = financialSlice.actions;

export default financialSlice.reducer;