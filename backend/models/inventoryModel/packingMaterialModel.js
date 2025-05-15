const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence');
const AutoIncrement = mongooseSequence(mongoose);

const packingMaterialSchema = new mongoose.Schema({
    packingMaterialId: { type: Number, unique: true, index: true },
    name: {type: String, required: [true, 'Product name is required'],},
    quantity: {type: Number,min: [0, 'Quantity must be a positive number'],},
    unit: {type: String },
    reorder_level: {type: Number,default: 0,min: [0, 'Reorder level cannot be negative'],},
    unit_price: {type: Number,default: 0,min: [0, 'Unit price cannot be negative'],},
    supplier_name: {type: String },
    supplier_email: {type: String,match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],},
    supplier_phone: {type: String,match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],},
    location: {type: String,required: true, enum: ["Storage Room 1", "Storage Room 2", "Storage Room 3", "Main Rack Zone", "Cold Room"], default: "Storage Room 1" },
    received_date: {type: Date, default: Date.now,},
    expiry_date: { type: Date,
      validate: {
        validator: function (value) {
          return value > Date.now();
        },
        message: 'Expiry date must be in the future',
      },
    },
    status: {type: String,enum: ['In Stock', 'Low', 'Out of Stock'],default: 'In Stock',},
  },
  {
    timestamps: true,
  }
);

packingMaterialSchema.plugin(AutoIncrement, { inc_field: 'packingMaterialId' });
module.exports = mongoose.model('PackingMaterial', packingMaterialSchema);