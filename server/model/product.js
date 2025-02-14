// const mongoose = require('mongoose')

// const Schema = mongoose.Schema
// const productSchema = new Schema({

 
//  product_type:{
//     type:String,
//     trim:true

//  },
// file_type:[ ],

//  product_name:{
//     type:String

//  },
// category:{
//     type:String,
//     trim:true
//  },
//  subcategory:{
//     type:String
//  },
//  description:{
//     type:String,
//     trim:true 
// },
// offered_to:{
//     type:String,
//     trim:true
// },
// // employee_count_dependent:{
// //     type:String,
// //     trim:true
// // },


// // min_no_of_employees:{
// //     type:String
// // },
// // turnOver_dependent:{
// //     type:String
// // },
// // demo_available:{
// //     type:String
// // },
// price:{
//     type:String
// },
// discount:{
//     type:String
// },
// inStock:{
//     type:String
// },

// product_image:{
//     type:String
// },
// admin_approval:{
//     type:String,
//     default:"Pending"
// },
// supplier:{
//     type:Schema.Types.ObjectId,
//     ref:"supplier"
// },
// product_image:{
//     type:String
// },
// rate_card:{
//     type:String

// },
// quotation:{
//     type:String
// },
// brochure:{
//     type:String
// },
// service_for:{
//     type:String
// }

//   }, {timestamps:true,createdAt: 'createdAt', updatedAt: 'updatedAt'})


// module.exports = mongoose.model('product', productSchema)






const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema for Learning and Development specific fields
const learningAndDevelopmentSchema = new Schema({
  // program_title: { type: String, trim: true },
  duration: { type: String },
  duration_unit: { type: String },
  skill_level: { type: String },
  learning_objectives: { type: String },
  delivery_mode: { type: String },
  certification_type: { type: String },
  access_duration: { type: String },
  access_duration_unit: { type: String },
  support_type: { type: String },
  post_completion_resources: { type: String },
  cost: { type: String },
  currency: { type: String },
  enrollment_capacity: { type: String },
  languages: { type: String },
  instructor_credentials: { type: String },
  prerequisites: { type: String },
  assessment_evaluation: { type: String },
  description: { type: String, trim: true },
  refund_policy: { type: String },
}, { _id: false }); 

// Define a schema for Insurance specific fields

const insuranceSchema = new Schema({
  coverage_amount: { type: String },
  premium_cost: { type: String },
  policy_term: { type: String },
  eligibility_criteria: { type: String },
  policy_inclusions: { type: String },
  policy_exclusions: { type: String },
  waiting_period: { type: String },
  claim_process: { type: String },
  deductible: { type: String },
  co_payment_percentage: { type: String },
  renewability_option: { type: String },
  network_providers: { type: String },
  add_ons: { type: String },
  free_look_period: { type: String },
  no_claim_bonus: { type: String },
  grace_period: { type: String },
  policy_document_url: { type: String },

}, { _id: false });


// Main product schema
const productSchema = new Schema({
      product_type: { type: String, trim: true },
  file_type: [String],
  product_name: { type: String },
  category: { type: String, trim: true },
  subcategory: { type: String },
  supplier: { type: Schema.Types.ObjectId, ref: "supplier" },
  product_image: { type: String },
  admin_approval: { type: String, default: "Pending" },
  supplier_approval: { type: String, default: "Inactive" },
  purchaseCount: {type: Number,default: 0},

//   offered_to: { type: String, trim: true },
//   price: { type: String },
//   discount: { type: String },
//   inStock: { type: String },
//   product_image: { type: String },
//   rate_card: { type: String },
//   quotation: { type: String },
//   brochure: { type: String },
//   service_for: { type: String },
  // Conditionally nested Learning and Development fields
  learning_and_development: learningAndDevelopmentSchema,
  insurance: insuranceSchema, 

}, { timestamps: true, createdAt: 'createdAt', updatedAt: 'updatedAt' });

module.exports = mongoose.model('product', productSchema);
