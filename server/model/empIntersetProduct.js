const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining the schema for employee interest in products
const empInterestProSchema = new Schema(
  {
    // Storing the employee information as an embedded subdocument
    employee: {
      employeeId: {
        type: String,
        default: "",
      },
      employeeCode: {
        type: String,
        default: "",
      },
      employeeName: {
        type: String,
        default: "",
      },
      gender: {
        type: String,
        default: "",
      },
      dateofBirth: {
        type: String,
        default: "",
      },
      dateofJoining: {
        type: String,
        default: "",
      },
      position: {
        type: String,
        default: "",
      },
      currentSalary: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      tenant_id: {
        type: String,
        default: "",
      },
      rewardPoints: {
        type: Number,
        default: 0,
      },

    },
    insurance_Details: {
      health_insurance: {
        who_to_insure: {
          self: {
            type: Boolean,
            default: false,
          },
          spouse: {
            type: Boolean,
            default: false,
          },
          son: {
            type: Boolean,
            default: false,
          },
          son_count:{
            type: Number,
          },
          daughter: {
            type: Boolean,
            default: false,
          },
          daughter_count:{
            type: Number,
          },
        },
        cover_amount: {
          type: String,
        },
        full_name: {
          type: String,
        },
        age: {
          type: String,
        },
        gender: {
          type: String,
        },
        mobile_number: {
          type: String,
        },
      },
      motor_insurance: {
        vehicle_no:{
          type: String,
        },
        prev_policy:{
          type:String,
        },
        any_cliams_prev:{
          type:String,
        },
        full_name_motor: {
          type: String,
        },
        mobile_number_motor: {
          type: String,
        },
      },
      life_insurance: {
        full_name_life:{
          type: String,
        },
        gender_life:{
          type:String,
        },
        age_life:{
          type:String,
        },
        mobile_number_life: {
          type: String,
        },
        anual_income_life: {
          type: String,
        },
        cover_amount_life: {
          type: String,
        },  
        smoke_status_life: {
          type: String,
        },
      }
      
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "supplier",
    },
    empProStatus: {
      type: String,
      default: "Requested",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("empInterestPro", empInterestProSchema);
