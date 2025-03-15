const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Categories Schema
const categories_model = new Schema({
    type: { 
        type: String, 
        required: [true, "Category type is required"], 
        enum: ["Investment", "Savings", "Expense"], // Allow only specific types
        default: "Investment" 
    },
    color: { 
        type: String, 
        required: [true, "Color is required"], 
        default: '#FCBE44' 
    }
});

// Transactions Schema
const transaction_model = new Schema({
    name: { 
        type: String, 
        required: [true, "Transaction name is required"], 
        trim: true 
    },
    type: { 
        type: String, 
        required: [true, "Transaction type is required"], 
        enum: ["Investment", "Savings", "Expense"] // Ensure valid categories
    },
    amount: { 
        type: Number, 
        required: [true, "Amount is required"], 
        min: [1, "Amount must be at least 1"], 
        max: [20000, "Amount cannot exceed 20,000"]
    },
    date: { 
        type: Date, 
        required: [true, "Date is required"], 
        validate: {
            validator: function(value) {
                return value <= new Date(); // Ensure date is not in the future
            },
            message: "Date cannot be in the future"
        },
        default: () => new Date().toISOString().split('T')[0] // Save only YYYY-MM-DD format
    }
});

// Create models
const Categories = mongoose.model('categories', categories_model);
const Transaction = mongoose.model('transactions', transaction_model); // Ensure pluralization consistency

// Export the models
module.exports = {
    Categories,
    Transaction
};
