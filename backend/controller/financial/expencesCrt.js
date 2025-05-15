const model = require('../../models/financialModel/expencesmodel');

// Define color types for each category
const typecolor = {
    Savings: "#5417FAFF",
    Expense: "#39E042FF",
    Investment: "#C20D77FF",
};

// Helper function to validate transaction input
function validateTransactionInput({ name, type, amount, date }) {
    let errors = [];

    if (!name || name.trim() === "") errors.push("Transaction name is required.");
    if (!type || !typecolor[type]) errors.push("Invalid transaction type.");
    if (amount === undefined || amount < 1 || amount > 20000) errors.push("Amount must be between 1 and 20,000.");
    if (date && isNaN(Date.parse(date))) errors.push("Invalid date format.");

    return errors;
}

// Post categories
async function create_Categories(req, res) {
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
async function get_Categories(req, res) {
    try {
        let data = await model.Categories.find({});
        let filter = data.map(v => ({ type: v.type, color: v.color }));
        return res.json(filter);
    } catch (err) {
        return res.status(500).json({ message: `Error fetching categories: ${err}` });
    }
}

// Post transaction with validation
async function create_Transaction(req, res) {
    try {
        if (!req.body) return res.status(400).json({ message: "Request body is missing." });

        let { name, type, amount, date } = req.body;

        
        const errors = validateTransactionInput({ name, type, amount, date });
        if (errors.length > 0) return res.status(400).json({ errors });

        let category = await model.Categories.findOne({ type });
        if (!category) {
            try {
                const color = typecolor[type];
                category = await new model.Categories({ type, color }).save();
            } catch (error) {
                return res.status(400).json({ message: `Error while creating category: ${error}` });
            }
        }

        const create = new model.Transaction({
            name,
            type,
            amount,
            date: date ? new Date(date) : new Date(), 
        });

        await create.save();
        return res.json(create);

    } catch (err) {
        return res.status(400).json({ message: `Error while creating transaction: ${err}` });
    }
}

// Get transactions with date formatting
async function get_Transaction(req, res) {
    try {
        let data = await model.Transaction.find({});

      
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
async function edit_Transaction(req, res) {
    const _id = req.params.id; 
    const { name, type, amount, date } = req.body; 

    if (!_id) {
        return res.status(400).json({ message: "Transaction ID is required" });
    }

    
    const errors = validateTransactionInput({ name, type, amount, date });
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        // Update the transaction record, including the date
        const updatedTransaction = await model.Transaction.findByIdAndUpdate(
            _id,
            { name, type, amount, date: date ? new Date(date) : undefined }, 
            { new: true } 
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        return res.json(updatedTransaction);
    } catch (err) {
        return res.status(400).json({ message: `Error while updating transaction: ${err.message}` });
    }
}

// Delete transaction
async function delete_Transaction(req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Transaction ID is required." });

        const deletedTransaction = await model.Transaction.findByIdAndDelete(id);
        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found." });
        }

        return res.json({ message: "Transaction deleted successfully." });
    } catch (err) {
        return res.status(500).json({ message: "Error while deleting Transaction Record." });
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
    create_Transaction,
    get_Transaction,
    edit_Transaction, 
    delete_Transaction,
    get_Labels
};
