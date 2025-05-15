const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence');
const AutoIncrement = mongooseSequence(mongoose);

const finalProductSchema = new mongoose.Schema(
  {
    finalProductId: { type: Number, unique: true, index: true }, 
    name: { type: String, required: [true, 'Product name is required'],},
    quantity: { type: Number, min: [1, 'Quantity must be a positive number'],},
    unit: {type: String },
    reorder_level: {type: Number,default: 0,min: [0, 'Reorder level cannot be negative'],},
    unit_price: { type: Number, min: [0, "Unit price can't be negative"],},
    Description: { type: String },
    location: { type: String, enum: ["Storage Room 1", "Storage Room 2", "Storage Room 3", "Main Rack Zone", "Cold Room",],default: "Storage Room 2",},
    received_date: { type: Date, default: Date.now,},
    expiry_date: {
      type: Date,
      validate: {
        validator: function(value) {
          return value > Date.now();
        },
        message: 'Expiry date must be in the future',
      },
    },
    status: { type: String, enum: ['In Stock', 'Low', 'Out of Stock'], default: 'In Stock',},
  },
  {
    timestamps: true, 
  }
);

finalProductSchema.plugin(AutoIncrement, { inc_field: 'finalProductId' });
module.exports = mongoose.model('FinalProduct', finalProductSchema);