const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Income Category Schema
const income_categories_model = new Schema({
    type: { 
        type: String, 
        required: [true, "Category type is required"], 
        enum: ["Income"], 
        default: "Income" 
    },
    color: { 
        type: String, 
        required: [true, "Color is required"], 
        default: '#10B981' 
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
        enum: ["Income"], 
        default: "Income"
    },
    amount: { 
        type: Number, 
        required: [true, "Amount is required"], 
        min: [1, "Amount must be at least 1"], 
        max: [100000, "Amount cannot exceed 100,000"] 
    },
    date: { 
        type: Date, 
        required: [true, "Receipt date is required"], 
        validate: {
            validator: function(value) {
                return value <= new Date(); 
            },
            message: "Date cannot be in the future"
        },
        default: () => new Date().toISOString().split('T')[0] 
    }
});

// Create models with unique collection names for income
const IncomeCategories = mongoose.model('income_categories', income_categories_model);
const IncomeTransaction = mongoose.model('income_transactions', income_transaction_model); 

// Export the models
module.exports = {
    IncomeCategories,
    IncomeTransaction
};
