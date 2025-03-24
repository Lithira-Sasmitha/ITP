const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Income Category Schema
const income_categories_model = new Schema({
    type: { 
        type: String, 
        required: [true, "Category type is required"], 
        enum: ["Income"], // Only allow Income type
        default: "Income" 
    },
    color: { 
        type: String, 
        required: [true, "Color is required"], 
        default: '#10B981' // Default green color for income
    }
});

// Income Transactions Schema
const income_transaction_model = new Schema({
    name: { 
        type: String, 
        required: [true, "Income source name is required"], 
        trim: true 
    },
    type: { 
        type: String, 
        required: [true, "Transaction type is required"], 
        enum: ["Income"], // Only Income type allowed
        default: "Income"
    },
    amount: { 
        type: Number, 
        required: [true, "Amount is required"], 
        min: [1, "Amount must be at least 1"], 
        max: [100000, "Amount cannot exceed 100,000"] // Higher max for income
    },
    date: { 
        type: Date, 
        required: [true, "Receipt date is required"], 
        validate: {
            validator: function(value) {
                return value <= new Date(); // Ensure date is not in the future
            },
            message: "Date cannot be in the future"
        },
        default: () => new Date().toISOString().split('T')[0] // Save only YYYY-MM-DD format
    }
});

// Create models with unique collection names for income
const IncomeCategories = mongoose.model('income_categories', income_categories_model);
const IncomeTransaction = mongoose.model('income_transactions', income_transaction_model); 

// Export the models
module.exports = {
    income: {
        apiIncome: '/api/income-categories',
        apiTransaction: '/api/income-transaction'
      }
};