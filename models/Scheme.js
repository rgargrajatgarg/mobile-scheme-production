const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
    {
      name: String,
      start_date: Date,
      end_date: Date,
      condition_type: String,
      creditNote: Number,
      price_condition: {
          operator: String,
          price : Number
      },
      data_header:{
            date: String,
            price: String,
            model: String
      },
      excel_data: Object,
      creditValue:{
          creditType: String,
          creditValue: Number
      },
      excel_file: Object
    }
);

module.exports = mongoose.model('Scheme', schemeSchema, 'SchemeDB')