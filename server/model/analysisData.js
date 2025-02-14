const mongoose = require("mongoose");

const connectDB = require("../../config/db");
const url =
  "mongodb+srv://corporatesolutions:0ftDgP7mxfUdrSPW@cluster0.vi29fgh.mongodb.net";
let db;

const Schema = mongoose.Schema;

const analysisSchema = new Schema(
  {
    tenant_id: {
      type: String,
      default: "",
    },
    noOfClaims: {
      grandTotal: {
        claims: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        incurredAmount: { type: Number, default: 0 },
      },
      cashless: {
        cancelled: { type: Number, default: 0 },
        repudiated: { type: Number, default: 0 },
        inProgress: { type: Number, default: 0 },
        settled: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        claim_number_percent: { type: String, default: 0 },
      },
      reimbursement: {
        cancelled: { type: Number, default: 0 },
        repudiated: { type: Number, default: 0 },
        inProgress: { type: Number, default: 0 },
        settled: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        claim_number_percent: { type: String, default: 0 },
      },
    },

    noOfClaimsPercentage: {
      cashlessPercentage: {
        cancelledPercentage: { type: String, default: 0 },
        repudiatedPercentage: { type: String, default: 0 },
        inProgressPercentage: { type: String, default: 0 },
        settledPercentage: { type: String, default: 0 },
      },
      reimbursementPercentage: {
        cancelledPercentage: { type: String, default: 0 },
        repudiatedPercentage: { type: String, default: 0 },
        inProgressPercentage: { type: String, default: 0 },
        settledPercentage: { type: String, default: 0 },
      },
    },
    claimAmount: {
      cashless: {
        cancelled: { type: Number, default: 0 },
        repudiated: { type: Number, default: 0 },
        inProgress: { type: Number, default: 0 },
        settled: { type: Number, default: 0 },
        toatalAmount: { type: Number, default: 0 },
      },
      reimbursement: {
        cancelled: { type: Number, default: 0 },
        repudiated: { type: Number, default: 0 },
        inProgress: { type: Number, default: 0 },
        settled: { type: Number, default: 0 },
        toatalAmount: { type: Number, default: 0 },
      },
    },
    incurredAmount: {
      cashless: {
        cancelled: { type: Number, default: 0 },
        repudiated: { type: Number, default: 0 },
        inProgress: { type: Number, default: 0 },
        settled: { type: Number, default: 0 },
        toatalAmount: { type: Number, default: 0 },
      },
      reimbursement: {
        cancelled: { type: Number, default: 0 },
        repudiated: { type: Number, default: 0 },
        inProgress: { type: Number, default: 0 },
        settled: { type: Number, default: 0 },
        toatalAmount: { type: Number, default: 0 },
      },
    },

    claimAmountPercentage: {
      cashlessPercentage: {
        cancelledPercentage: { type: String, default: 0 },
        repudiatedPercentage: { type: String, default: 0 },
        inProgressPercentage: { type: String, default: 0 },
        settledPercentage: { type: String, default: 0 },
        totalPercentage: { type: String, default: 0 },
      },
      reimbursementPercentage: {
        cancelledPercentage: { type: String, default: 0 },
        repudiatedPercentage: { type: String, default: 0 },
        inProgressPercentage: { type: String, default: 0 },
        settledPercentage: { type: String, default: 0 },
        totalPercentage: { type: String, default: 0 },
      },
    },

    incurredAmountPercentage: {
      cashlessPercentage: {
        cancelledPercentage: { type: String, default: 0 },
        repudiatedPercentage: { type: String, default: 0 },
        inProgressPercentage: { type: String, default: 0 },
        settledPercentage: { type: String, default: 0 },
        totalPercentage: { type: String, default: 0 },
      },
      reimbursementPercentage: {
        cancelledPercentage: { type: String, default: 0 },
        repudiatedPercentage: { type: String, default: 0 },
        inProgressPercentage: { type: String, default: 0 },
        settledPercentage: { type: String, default: 0 },
        totalPercentage: { type: String, default: 0 },
      },
    },

    relationships: {
      grandTotal: {
        claims: { type: Number, default: "" },
        claimedAmount: { type: Number, default: "" },
        incurredAmount: { type: Number, default: "" },
      },

      Daughter: {
        claims: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        incurredAmount: { type: Number, default: 0 },
      },
      Father: {
        claims: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        incurredAmount: { type: Number, default: 0 },
      },
      Mother: {
        claims: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        incurredAmount: { type: Number, default: 0 },
      },
      Self: {
        claims: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        incurredAmount: { type: Number, default: 0 },
      },
      Son: {
        claims: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        incurredAmount: { type: Number, default: 0 },
      },
      Spouse: {
        claims: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        incurredAmount: { type: Number, default: 0 },
      },
    },
    gender: {
      grandTotal: {
        claims: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        incurredAmount: { type: Number, default: 0 },
      },
      Female: {
        claims: { type: Number, default: 0 },
        claimAmount: { type: Number, default: 0 },
        incurredAmount: { type: Number, default: 0 },
      },
      Male: {
        claims: { type: Number, default: 0 },
        claimAmount: { type: Number, default: 0 },
        incurredAmount: { type: Number, default: 0 },
      },
    },
    ageCliams: {
      claimsByage: [],
      grandTotal: [],
    },
    citiesByCliamed: {
      cityData: [Object],
      grandTotal: {
        claimAmount: { type: String },
        incurrAmount: { type: String },
      },
    },
    claimsBycategory: {
      room_rent: {
        claims: { type: String },
        amount: { type: String },
      },
      maternity: {
        claims: { type: String },
        amount: { type: String },
      },
      buffer_utilization: {
        claims: { type: String },
        amount: { type: String },
      },
      critical_illness: {
        claims: { type: String },
        amount: { type: String },
      },
    },
    copay_claims: {
      with_copay: {
        claims: { type: String },
        amount: { type: String },
      },
      without_copay: {
        claims: { type: String },
        amount: { type: String },
      },
    },
    providerHospitalClaims: {
      providerData: [],
      grandTotal: {
        claimAmount: { type: String },
        incurrAmount: { type: String },
      },
    },
    ailmentClaims: {
      diseaseClaims: [],
      grandTotal: {
        claimAmount: { type: String },
        incurrAmount: { type: String },
        totalClaims: { type: String },
      },
    },

    membersData: {
      gender: {
        male: { type: String, default: 0 },
        female: { type: String, default: 0 },
        total: { type: String, default: 0 },
      },
      relationshipInsured: {
        child: { type: String, default: 0 },
        parent: { type: String, default: 0 },
        employee: { type: String, default: 0 },
        parentinlaw: { type: String, default: 0 },
        spouse: { type: String, default: 0 },
        total: { type: String, default: 0 },
      },
      insuredByGrade: {
        grade_I: { type: String, default: 0 },
        grade_II: { type: String, default: 0 },
        grade_III: { type: String, default: 0 },
        grade_IV: { type: String, default: 0 },
        grade_V: { type: String, default: 0 },
        grade_VI: { type: String, default: 0 },

        total: { type: String, default: 0 },
      },
      Change_in_SA_from_previous_Year: {
        currentAndProposed: [],
        grandTotal: {
          proposed: { type: String, default: 0 },
          totalClaims: { type: String, default: 0 },
        },
      },
      Age_Band: [],
    },
    premiumData: {
      inceptionLifeRate: { type: String, default: ""  },
      claimIncidentRate: { type: String, default: ""  },
      claimAverage: { type: String, default: ""  },
      annualClaims: { type: String, default: ""  },
      ultimateLossRatio: { type: String, default: ""  },
      riskPremiumBurn: { type: String, default: ""  },
      grossPremiumWithbrokerage: { type: String, default: ""  },
      grossPremiumWithoutbrokerage: { type: String, default: ""  },
    },
    Rjac_values: {
      companyStatistics: {
        employee: {
          total_employee: { type: String, default: "" },
          total_yearly_salary: { type: String, default: "" },
          average_age: { type: String, default: "" },
          average_past_service: { type: String, default: "" },
          average_entry_age: { type: String, default: "" },
        },
        gratuityLiability: {
          DBO: { type: String, default: "" },
          year1: { type: String, default: "" },
          year2: { type: String, default: "" },
          year3: { type: String, default: "" },
          year4: { type: String, default: "" },
          year5: { type: String, default: "" },
          year6: { type: String, default: "" },
          total: { type: String, default: "" },

        },
        salaryEscalation: {
          First3year: { type: String, default: "" },
          After3year: { type: String, default: "" },
        },
        AttritionRate: {
          fixedRate: { type: String, default: "" },
          // terminationRate:{type:String},
          // resignationRate:{type:String},
        },
        WithDrawRate: {
          withdrawRate1: { type: String, default: "" },
          // terminationRate:{type:String},
          // resignationRate:{type:String},
        },
      },
      Leaves: {
        leaves: []
      },



    },
    TcEmmployeeData: {
      employeeStructure: {
        Departments: {
          departments: [],
          totalEmployeescount: { type: String },
        },

        Positions: {
          position: [],
          totalEmployees: { type: String },
          positionSlarayRange: [],
          positionWithAge: []
        },

      }

    },
    employees: []
  },
  { timestamps: true }
);

const claimModel = mongoose.model("analysis", analysisSchema);

const getAnalysisDB = async (tenantId) => {
  const dbName = `Tenant-${tenantId}`;
  db = db ? db : await connectDB(url);
  let tenantDb = db.useDb(dbName, { useCache: true });
  return tenantDb;
};

const getAnalysisModel = async (tenantId) => {
  const tenantDb = await getAnalysisDB(tenantId);
  return tenantDb.model("analysis", analysisSchema);
};

module.exports = getAnalysisModel;
