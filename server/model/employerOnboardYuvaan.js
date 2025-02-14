const mongoose = require('mongoose');

const YuvaanOnboardingSchema = new mongoose.Schema({
    employer_info: {
        company_name: { type: String },
        industry: { type: String },
        number_of_employees: { type: Number },
        headquarters_location: { type: String },
        contact_person: {
            name: { type: String },
            email: { type: String },
            phone_number: { type: String }
        }
    },
    employee_benefits: {
        current_benefits: [{ type: String }],
        existing_service_providers: {
            is_provided: { type: Boolean },
            details: { type: String }
        },
        areas_of_concern: { type: String },
        primary_objectives: { type: String },
        budget_allowances: {
            transportation_allowance: { type: Number },
            housing_allowance: { type: Number },
            mobile_internet_allowance: { type: Number }
        }
    },
    health_wellness_programs: {
        is_offered: { type: Boolean },
        programs_offered: [{ type: String }],
        wellness_focus_areas: [{ type: String }],
        budget: {
            doctor_teleconsultations: { type: Number },
            annual_checkups: { type: Number },
            diagnostic_tests: { type: Number },
            pharmacy_medicine: { type: Number },
            individual_gym_memberships: { type: Number },
            corporate_gym_memberships: { type: Number },
            yoga_meditation_facilities: { type: Number }
        }
    },
    insurance_schemes: {
        current_schemes: [{ type: String }],
        evaluating_new_schemes: {
            is_evaluating: { type: Boolean },
            new_schemes: [{ type: String }]
        },
        budget: {
            group_medical: { type: Number },
            group_personal_accident: { type: Number },
            group_term_life: { type: Number },
            motor_insurance: { type: Number },
            professional_indemnity: { type: Number },
            d_and_o_liability: { type: Number },
            employers_liability: { type: Number },
            cyber_insurance: { type: Number },
            business_interruption: { type: Number }
        }
    },
    // regulatory_benefits: {
    //     is_offered: { type: Boolean },
    //     leave_encashment: { type: String },
    //     compliance_issues: { type: String }
    // },
    // learning_development: {
    //     current_programs: [{ type: String }],
    //     expansion_areas: [{ type: String }],
    //     budget: {
    //         employee_training: { type: Number },
    //         recreational_activities: { type: Number },
    //         reimbursements: { type: Number }
    //     }
    // },
    // data_analytics: {
    //     is_used: { type: Boolean },
    //     tools_used: [{ type: String }],
    //     key_metrics: [{ type: String }]
    // },
    // cost_optimization: {
    //     is_exploring: { type: Boolean },
    //     concerned_areas: [{ type: String }]
    // },
    additional_comments: { type: String }
});

const OnboardingFormYuvaan = mongoose.model('OnboardingFormYuvaan', YuvaanOnboardingSchema);

module.exports = OnboardingFormYuvaan;