/**
 * Normalizes the extracted data
 */
const normalizeData = (data) => {
    // Basic normalization logic
    if (data.medications) {
        data.medications = data.medications.map(med => ({
            ...med,
            medicine_name: med.medicine_name || 'Unknown',
            dosage: med.dosage || 'Not provided',
            frequency: med.frequency || 'Not provided',
        }));
    }
    return data;
};

/**
 * Applies safety checks for dosage and interactions
 */
const applySafetyChecks = (data) => {
    // Basic heuristic safety checks
    if (data.medications) {
        data.medications.forEach(med => {
            med.warnings = med.warnings || [];
            // Example check: if dosage seems high (very basic)
            if (med.dosage && med.dosage.includes('mg') && parseInt(med.dosage) > 1000) {
                med.warnings.push('High dosage detected - please verify with doctor');
                med.risk_score = 0.5;
            }
        });
    }

    // Example interaction check placeholder
    data.interactions = data.interactions || [];

    return data;
};

/**
 * Generates a medication timeline/schedule
 */
const generateMedTimeline = (medications) => {
    const timeline = [];
    medications.forEach(med => {
        if (med.frequency) {
            timeline.push({
                medicine: med.medicine_name,
                schedule: med.frequency,
                instructions: med.special_instructions
            });
        }
    });
    return timeline;
};

module.exports = {
    normalizeData,
    applySafetyChecks,
    generateMedTimeline
};
