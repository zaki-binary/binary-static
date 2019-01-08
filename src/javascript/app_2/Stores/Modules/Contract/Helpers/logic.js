export const getChartConfig = (contract_info) => {
    const start = contract_info.date_start;
    const end   = contract_info.date_expiry;
    const granularity = calculateGranularity(end - start);

    return {
        granularity,
        chart_type : granularity ? 'candle' : 'mountain',
        end_epoch  : end   + (granularity || 3),
        start_epoch: start - (granularity || 3),
    };
};

const hour_to_granularity_map = [
    [1      , 0],
    [2      , 120],
    [6      , 600],
    [24     , 900],
    [5 * 24 , 3600],
    [30 * 24, 14400],
];
const calculateGranularity = (duration) =>
    (hour_to_granularity_map.find(m => duration <= m[0] * 3600) || [null, 86400])[1];

export const getDisplayStatus = (contract_info) => {
    let status = 'purchased';
    if (isEnded(contract_info)) {
        status = contract_info.profit >= 0 ? 'won' : 'lost';
    }
    return status;
};

// for path dependent contracts the contract is sold from server side
// so we need to use sell spot and sell spot time instead
export const getEndSpot = (contract_info) => (
    contract_info.is_path_dependent ? contract_info.sell_spot : contract_info.exit_tick
);

export const getEndSpotTime = (contract_info) => (
    contract_info.is_path_dependent ? contract_info.sell_spot_time : contract_info.exit_tick_time
);

export const getFinalPrice = (contract_info) => (
    +(contract_info.sell_price || contract_info.bid_price)
);

export const getIndicativePrice = (contract_info) => (
    getFinalPrice(contract_info) && isEnded(contract_info) ?
        getFinalPrice(contract_info) :
        (+contract_info.bid_price || null)
);

export const isEnded = (contract_info) => !!(
    (contract_info.status && contract_info.status !== 'open') ||
    contract_info.is_expired        ||
    contract_info.is_settleable
);

export const isSoldBeforeStart = (contract_info) => (
    contract_info.sell_time && +contract_info.sell_time < +contract_info.date_start
);

export const isStarted = (contract_info) => (
    !contract_info.is_forward_starting || contract_info.current_spot_time > contract_info.date_start
);

export const isUserSold = (contract_info) => (
    contract_info.status === 'sold'
);

export const isValidToSell = (contract_info) => (
    !isEnded(contract_info) && !isUserSold(contract_info) && +contract_info.is_valid_to_sell === 1
);
