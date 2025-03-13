const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// categories => field => ['type', 'color']
const categories_model = new Schema({
  type: { type: String, default: "Anonymous" },
  color: { type: String, default: "#FCBE44" },
});

// transactions  => field => ['name', 'type', 'amount', 'date']
const income_model = new Schema({
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

const Income = mongoose.model("income", income_model);
const Categories = mongoose.model("categories", categories_model);

exports.default = Income;
exports.default = Categories;

module.exports = {
  Categories,
  Income,
};
