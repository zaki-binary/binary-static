/**
 * The purpose of this file is to store static strings of 'app_2' which are not passed in any localize() call
 * i.e. those API strings that are not translated, so we handle their translation process here
 *
 * NOTE: Doesn't need to put a string here if it is the first argument in a localize() call
 */
module.exports = [
    // action_type in statement response
    'Buy',
    'Sell',
    'Deposit',
    'Withdrawal',
];
