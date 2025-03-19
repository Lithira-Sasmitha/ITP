const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence');
const AutoIncrement = mongooseSequence(mongoose);


const rawMaterialSchema = new mongoose.Schema(
  {
    rawMaterialId: { type: Number, unique: true, index: true }, 
    name: { type: String,required: [true, 'Name is required'],},
    quantity: { type: Number,required: [true, 'Quantity is required'],min: [1, 'Quantity must be at least 1'],},
    unit: { type: String, required: [true, 'Unit is required'],},
    reorder_level: { type: Number, default: 0, min: [0, 'Reorder level cannot be negative'],},
    unit_price: { type: Number, min: [0, 'Unit price cannot be negative'],},
    supplier_name: { type: String,},
    supplier_email: { type: String, match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],},
    supplier_phone: { type: String, match: [/^\d{10}$/, 'Supplier contact must be exactly 10 digits'],},
    location: { type: String, enum: ["Storage Room 1", "Storage Room 2", "Storage Room 3", "Main Rack Zone", "Cold Room",],default: "Storage Room 2",},
    received_date: {type: Date, default: Date.now,},
    expiry_date: { type: Date,
      validate: {
        validator: function (value) {
          return value > Date.now();
        },
        message: 'Expiry date must be in the future',
      },
    },
    status: { type: String, enum: ["In Stock", "Low Stock", "Out of Stock"], default: "In Stock",},
  },
  {
    timestamps: true,
  }
);


rawMaterialSchema.plugin(AutoIncrement, { inc_field: 'rawMaterialId' });
module.exports = mongoose.model("RawMaterial", rawMaterialSchema);
