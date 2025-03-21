const model = require('../../models/financialModel/incomemodel');

// Define color for income category
const incomeColor = "#10B981FF"; // Emerald green

// Helper function to validate income input
function validateIncomeInput({ name, amount, date }) {
    let errors = [];

    if (!name || name.trim() === "") errors.push("Income name is required.");
    if (amount === undefined || amount < 1 || amount > 100000) errors.push("Amount must be between 1 and 100,000.");
    if (date && isNaN(Date.parse(date))) errors.push("Invalid date format.");

    return errors;
}

// Post income categories
async function create_Categories(req, res) {
    try {
        // For income, we only have one category type
        const create = new model.Categories({
            type: "Income",
            color: incomeColor,
        });

        await create.save();
        return res.json(create);
    } catch (err) {
        return res.status(400).json({ message: `Error while creating income category: ${err}` });
    }
}

// Get income categories
async function get_Categories(req, res) {
    try {
        let data = await model.Categories.find({ type: "Income" });
        let filter = data.map(v => ({ type: v.type, color: v.color }));
        return res.json(filter);
    } catch (err) {
        return res.status(500).json({ message: `Error fetching income categories: ${err}` });
    }
}

// Post income transaction with validation
async function create_Transaction(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "Request body is missing." });

        let { name, amount, date } = req.body;
        const type = "Income"; // Always set type to Income

        // Validate input
        const errors = validateIncomeInput({ name, amount, date });
        if (errors.length > 0) return res.status(400).json({ errors });

        // Check if Income category exists, create if not
        let category = await model.Categories.findOne({ type });
        if (!category) {
            try {
                category = await new model.Categories({ type, color: incomeColor }).save();
            } catch (error) {
                return res.status(400).json({ message: `Error while creating income category: ${error}` });
            }
        }

        const create = new model.Transaction({
            name,
            type,
            amount,
            date: date ? new Date(date) : new Date(), // Use provided date or default to today
        });

        await create.save();
        return res.json(create);

    } catch (err) {
        return res.status(400).json({ message: `Error while creating income transaction: ${err}` });
    }
}

// Get income transactions with date formatting
async function get_Transaction(req, res) {
    try {
        let data = await model.Transaction.find({ type: "Income" });

        // Format date before sending response
        let formattedData = data.map(transaction => ({
            ...transaction._doc,
            date: transaction.date.toISOString().split('T')[0] // Stores only YYYY-MM-DD
        }));

        return res.json(formattedData);
    } catch (err) {
        return res.status(500).json({ message: `Error fetching income transactions: ${err}` });
    }
}

// Edit income transaction
async function edit_Transaction(req, res) {
    const _id = req.params.id; // Access the ID from URL params
    const { name, amount, date } = req.body; // Get updated fields from request body
    const type = "Income"; // Always set type to Income

    if (!_id) {
        return res.status(400).json({ message: "Transaction ID is required" });
    }

    // Validate input
    const errors = validateIncomeInput({ name, amount, date });
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        // First check if the transaction is an income transaction
        const existingTransaction = await model.Transaction.findById(_id);
        if (!existingTransaction) {
            return res.status(404).json({ message: "Income transaction not found" });
        }
        
        if (existingTransaction.type !== "Income") {
            return res.status(400).json({ message: "Can only edit income transactions in this endpoint" });
        }

        // Update the transaction record, including the date
        const updatedTransaction = await model.Transaction.findByIdAndUpdate(
            _id,
            { name, type, amount, date: date ? new Date(date) : undefined }, // Update date if provided
            { new: true } // Return the updated transaction
        );

        return res.json(updatedTransaction);
    } catch (err) {
        return res.status(400).json({ message: `Error while updating income transaction: ${err.message}` });
    }
}

// Delete income transaction
async function delete_Transaction(req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Transaction ID is required." });

        // First check if the transaction is an income transaction
        const existingTransaction = await model.Transaction.findById(id);
        if (!existingTransaction) {
            return res.status(404).json({ message: "Income transaction not found." });
        }
        
        if (existingTransaction.type !== "Income") {
            return res.status(400).json({ message: "Can only delete income transactions in this endpoint" });
        }

        const deletedTransaction = await model.Transaction.findByIdAndDelete(id);
        return res.json({ message: "Income transaction deleted successfully." });
    } catch (err) {
        return res.status(500).json({ message: "Error while deleting income transaction." });
    }
}

// Get income labels
async function get_Labels(req, res) {
    try {
        let result = await model.Transaction.aggregate([
            {
                $match: { type: "Income" } // Only get Income transactions
            },
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
    create_Transaction,
    get_Transaction,
    edit_Transaction,
    delete_Transaction,
    get_Labels
};