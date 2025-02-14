const mongoose = require("mongoose");

const connectDB = require("../../config/db");
const url = "mongodb+srv://corporatesolutions:0ftDgP7mxfUdrSPW@cluster0.vi29fgh.mongodb.net";
let db;

const Schema = mongoose.Schema;

const analysisSchemaUAE = new Schema(
  {
    tenant_id: {
      type: String,
      default: "",
    },
    noOfClaims: {
      grandTotal: {
        claims: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        finalAmount: { type: Number, default: 0 },
      },
      providerClaimCount: {
        ipdPaidClaim: { type: Number, default: 0 },
        ipdUnPaidClaim: { type: Number, default: 0 },
        opdPaidClaim: { type: Number, default: 0 },
        opdUnPaidClaim: { type: Number, default: 0 },
        totalproviderClaimCount: { type: Number, default: 0 },
        providerClaimsPercentageIPDpaidDisplay: { type: String, default: 0 },
        providerClaimsPercentageIPDUnpaidDisplay: { type: String, default: 0 },
        providerClaimsPercentageOPDpaidDisplay: { type: String, default: 0 },
        providerClaimsPercentageOPDUnpaidDisplay: { type: String, default: 0 },
        totalproviderClaimCountPercentageDisplay: { type: String, default: 0 }
      },
      claimStatusFinalAmount: {
        approvedCount:{ type: Number, default: 0 },
        partiallyCount:{ type: Number, default: 0 },
        rejectedCount:{ type: Number, default: 0 },
        approvedFinal: { type: Number, default: 0 },
        partialApproveFinal: { type: Number, default: 0 },
        rejectedFinal: { type: Number, default: 0 },
      },

      providerClaimAmount: {
        ipdPaidClaimAmount: { type: Number, default: 0 },
        ipdUnPaidClaimAmount: { type: Number, default: 0 },
        opdPaidClaimAmount: { type: Number, default: 0 },
        opdUnPaidClaimAmount: { type: Number, default: 0 },
        totalproviderClaimAmount: { type: Number, default: 0 },
        providerClaimsAmountPercentageIPDpaidDisplay: { type: String, default: 0 },
        providerClaimsAmountPercentageIPDUnpaidDisplay: { type: String, default: 0 },
        providerClaimsAmountPercentageOPDpaidDisplay: { type: String, default: 0 },
        providerClaimsAmountPercentageOPDUnpaidDisplay: { type: String, default: 0 },
        totalproviderClaimAmountPercentageDisplay: { type: String, default: 0 }
      },

      providerFinalAmount: {
        ipdPaidFinalAmount: { type: Number, default: 0 },
        ipdUnPaidFinalAmount: { type: Number, default: 0 },
        opdPaidFinalAmount: { type: Number, default: 0 },
        opdUnPaidFinalAmount: { type: Number, default: 0 },
        totalproviderFinalAmount: { type: Number, default: 0 },
        providerFinalsAmountPercentageIPDpaidDisplay: { type: String, default: 0 },
        providerFinalsAmountPercentageIPDUnpaidDisplay: { type: String, default: 0 },
        providerFinalsAmountPercentageOPDpaidDisplay: { type: String, default: 0 },
        providerFinalsAmountPercentageOPDUnpaidDisplay: { type: String, default: 0 },
        totalproviderFinalAmountPercentageDisplay: { type: String, default: 0 }
      },
    },
    relationships: {
      daughter: {
        claimsCount: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        FinalAmount: { type: Number, default: 0 },
      },
      femaleWithoutM: {
        claimsCount: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        FinalAmount: { type: Number, default: 0 },
      },
      maleEmployee: {
        claimsCount: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        FinalAmount: { type: Number, default: 0 },
      },
      son: {
        claimsCount: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        FinalAmount: { type: Number, default: 0 },
      },
      wife: {
        claimsCount: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        FinalAmount: { type: Number, default: 0 },
      },
      grandTotal: {
        claimsCountTotal: { type: Number, default: "" },
        claimedAmountTotal: { type: Number, default: "" },
        finalAmountTotal: { type: Number, default: "" },
      },
    },
    beneficieryGender: {
      Male: {
        claimsCount: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        FinalAmount: { type: Number, default: 0 },
      },
      FeMale: {
        claimsCount: { type: Number, default: 0 },
        claimedAmount: { type: Number, default: 0 },
        FinalAmount: { type: Number, default: 0 },
      },
      grandTotal: {
        claimsCountTotal: { type: Number, default: "" },
        claimedAmountTotal: { type: Number, default: "" },
        finalAmountTotal: { type: Number, default: "" },
      },
    },
    benecitiesByCliamed: {
      cityData: [Object],
      grandTotal: {
        claimAmount: { type: String },
        finalAmount: { type: String },
        totalClaimedCount: { type: String },
      },
    },
    providerName: {
      hospitalData: [Object],
      grandTotal: {
        claimAmount: { type: String },
        finalAmount: { type: String },
        claimedCountProvider: { type: String }
      },
    },
    employeeMember: {
      emplyeeMemberData: [Object],
      grandTotal: {
        claimAmount: { type: String },
        finalAmount: { type: String },
        claimedCountProvider: { type: String }
      },
    },
    primaryICDName: {
      primaryICDData: [Object],
      grandTotal: {
        claimAmount: { type: String },
        finalAmount: { type: String },
        claimedCountProvider: { type: String }
      },
    },
    daignosisTypeNew: {
      daignosisTypeData: [Object],
      grandTotal: {
        claimAmount: { type: String },
        finalAmount: { type: String },
        claimedCountProvider: { type: String }
      },
    },

    // daignosisType: {
    //   BasicDiagnosis: {
    //     claimsCount: { type: Number, default: 0 },
    //     claimedAmount: { type: Number, default: 0 },
    //     FinalAmount: { type: Number, default: 0 },
    //   },
    //   ChronicDiagnosis: {
    //     claimsCount: { type: Number, default: 0 },
    //     claimedAmount: { type: Number, default: 0 },
    //     FinalAmount: { type: Number, default: 0 },
    //   },
    //   grandTotal: {
    //     claimsCountTotal: { type: Number, default: "" },
    //     claimedAmountTotal: { type: Number, default: "" },
    //     finalAmountTotal: { type: Number, default: "" },
    //   },
    // },

    membersData: {
      gender: {
        male: { type: String, default: 0 },
        female: { type: String, default: 0 },
        total: { type: String, default: 0 },
      },
      relationship: {
        male: { type: String, default: 0 },
        femaleMaternity: { type: String, default: 0 },
        femaleMaternity1: { type: String, default: 0 },
        son: { type: String, default: 0 },
        daughter: { type: String, default: 0 },
        TotalRelationshipCount: { type: String, default: 0 },
      },
      Age_Band: [],
    },
    premiumData: {
      inceptionLifeRate: { type: String },
      claimIncidentRate: { type: String },
      claimAverage: { type: String },
      annualClaims: { type: String },
      ultimateLossRatio: { type: String },
      riskPremiumBurn: { type: String },
      grossPremiumWithbrokerage: { type: String },
      grossPremiumWithoutbrokerage: { type: String },
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
        PastDate: {
          durationLiability: {type: Number, default: 0  },
          withdrawlRate: {
            yearX: {
              type: Number, default: 0 
            },
            yearX_1: {
              type: Number, default: 0 
            },
            final:{
              type: Number, default: 0 
            },
          
          },
          salaryEscalationRate: {
            yearX: {
              type: Number, default: 0 
            },
            yearX_1: {
              type: Number, default: 0 
            },
            final:{
              type: Number, default: 0 
            },
          }
        }
      },
      Leaves: {
        leaves: [],
        leaveLiability: {
       
          year1: { type: String, default: "" },
          year2: { type: String, default: "" },
          year3: { type: String, default: "" },
          year4: { type: String, default: "" },
          year5: { type: String, default: "" },
          year6: { type: String, default: "" },
        },
        openingLeave: {
          yearX: {
            type: Number, default: 0 
          },
          yearX_1: {
            type: Number, default: 0 
          },
          yearX_2:{
            type: Number, default: 0 
          },
        },
        closingLeave: {
          yearX: {
            type: Number, default: 0 
          },
          yearX_1: {
            type: Number, default: 0 
          },
          yearX_2:{
            type: Number, default: 0 
          },
        }
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
        empNationality: []


      }

    },

  },
  { timestamps: true }
);

const claimModelUAE = mongoose.model("analysisUAE", analysisSchemaUAE);

const getAnalysisDBUAE = async (tenantId) => {
  const dbName = `Tenant-${tenantId}`;
  db = db ? db : await connectDB(url);
  let tenantDb = db.useDb(dbName, { useCache: true });
  return tenantDb;
};

const getAnalysisModelUAE = async (tenantId) => {
  const tenantDb = await getAnalysisDBUAE(tenantId);
  return tenantDb.model("analysisUAE", analysisSchemaUAE);
};

module.exports = getAnalysisModelUAE;
