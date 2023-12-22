const calculateTips = (bill, tipPercent = 20) => bill + (bill * (tipPercent/100))

const FtoC = (f) => (f - 32) * 1.8

const CtoF = (c) => (c * 1.8) + 32;

module.exports = {
    calculateTips,
    CtoF,
    FtoC
}