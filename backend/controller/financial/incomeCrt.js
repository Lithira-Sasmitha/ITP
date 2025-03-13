const model = require('../models/model');

// Define color types for each category
const typecolor = {
    Savings: "#5417FAFF",
};

// Helper function to validate transaction input
function income({ name, type, amount, date }) {
    let errors = [];

    if (!name || name.trim() === "") errors.push("income name is required.");
    if (!type || !typecolor[type]) errors.push("Invalid income type.");
    if (amount === undefined || amount < 1 || amount > 20000) errors.push("Amount must be between 1 and 20,000.");
    if (date && isNaN(Date.parse(date))) errors.push("Invalid date format.");

    return errors;
}

// Post categories
async function create_income(req, res) {
    try {
        if (!req.body.type || !req.body.color) {
            return res.status(400).json({ message: "Category type and color are required." });
        }

        const create = new model.Categories({
            type: req.body.type,
            color: req.body.color,
        });

        await create.save();
        return res.json(create);
    } catch (err) {
        return res.status(400).json({ message: `Error while creating categories: ${err}` });
    }
}

// Get categories
async function get_income(req, res) {
    try {
        let data = await model.Categories.find({});
        let filter = data.map(v => ({ type: v.type, color: v.color }));
        return res.json(filter);
    } catch (err) {
        return res.status(500).json({ message: `Error fetching categories: ${err}` });
    }
}

// Post transaction with validation
async function create_income(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "Request body is missing." });

        let { name, type, amount, date } = req.body;

        // Validate input
        const errors = validateTransactionInput({ name, type, amount, date });
        if (errors.length > 0) return res.status(400).json({ errors });

        let category = await model.Categories.findOne({ type });
        if (!category) {
            try {
                const color = typecolor[type];
                category = await new model.Categories({ type, color }).save();
            } catch (error) {
                return res.status(400).json({ message: `Error while creating income: ${error}` });
            }
        }

        const create = new model.income({
            name,
            type,
            amount,
            date: date ? new Date(date) : new Date(), // Use provided date or default to today
        });

        await create.save();
        return res.json(create);

    } catch (err) {
        return res.status(400).json({ message: `Error while creating income: ${err}` });
    }
}

// Get transactions with date formatting
async function get_income(req, res) {
    try {
        let data = await model.Transaction.find({});

        // Format date before sending response
        let formattedData = data.map(transaction => ({
            ...transaction._doc,
            date: transaction.date.toISOString().split('T')[0] // Stores only YYYY-MM-DD
        }));

        return res.json(formattedData);
    } catch (err) {
        return res.status(500).json({ message: `Error fetching transactions: ${err}` });
    }
}

// Edit transaction (Includes validation and date update)
async function edit_income(req, res) {
    const _id = req.params.id; // Access the ID from URL params
    const { name, type, amount, date } = req.body; // Get updated fields from request body

    if (!_id) {
        return res.status(400).json({ message: "Transaction ID is required" });
    }

    // Validate input
    const errors = validateincome({ name, type, amount, date });
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        // Update the transaction record, including the date
        const updatedTransaction = await model.Transaction.findByIdAndUpdate(
            _id,
            { name, type, amount, date: date ? new Date(date) : undefined }, // Update date if provided
            { new: true } // Return the updated transaction
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "income not found" });
        }

        return res.json(updatedTransaction);
    } catch (err) {
        return res.status(400).json({ message: `Error while updating income: ${err.message}` });
    }
}

// Delete transaction
async function delete_income(req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "income ID is required." });

        const deletedTransaction = await model.Transaction.findByIdAndDelete(id);
        if (!deletedTransaction) {
            return res.status(404).json({ message: "income not found." });
        }

        return res.json({ message: "income deleted successfully." });
    } catch (err) {
        return res.status(500).json({ message: "Error while deleting income Record." });
    }
}

// Get labels
async function get_Labels(req, res) {
    try {
        let result = await model.Transaction.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: 'type',
                    foreignField: "type",
                    as: "categories_info"
                }
            },
            {
                $unwind: "$categories_info"
            }
        ]);

        let data = result.map(v => ({
            _id: v._id,
            name: v.name,
            type: v.type,
            amount: v.amount,
            date: v.date.toISOString().split('T')[0], // Format date
            color: v.categories_info.color
        }));

        return res.json(data);
    } catch (error) {
        return res.status(400).json({ message: "Lookup Collection Error", error });
    }
}

module.exports = {
    create_Categories,
    get_Categories,
    create_income,
    get_income,
    edit_income, // Updated to include date validation
    delete_income,
    get_Labels
};
