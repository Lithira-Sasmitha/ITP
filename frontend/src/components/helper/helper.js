import _ from 'lodash';

// Get sum by transaction type
export function getSum(transaction, type) {
    if (!transaction || !transaction.length) return [];
    
    let sum = _(transaction)
        .groupBy("type")
        .map((objs, key) => {
            if(!type) return _.sumBy(objs, 'amount'); // [300, 350, 500]
            return {
                'type': key,
                'color': objs[0].color,
                'total': _.sumBy(objs, 'amount')
            }
        })
        .value();
    
    return sum;
}

// Get income transactions only
export function getIncomeSum(transaction, type) {
    if (!transaction || !transaction.length) return [];
    
    // Filter only income transactions
    const incomeTransactions = transaction.filter(t => t.type === 'Income');
    
    return getSum(incomeTransactions, type);
}

// Get labels with percentages
export function getLabels(transaction) {
    if (!transaction || !transaction.length) return [];
    
    let amountSum = getSum(transaction, 'type');
    let Total = _.sum(getSum(transaction));
    
    if (Total === 0) return [];

    let percent = _(amountSum)
        .map(objs => _.assign(objs, { percent: (100 * objs.total) / Total }))
        .value();
        
    return percent;
}

// Get income labels only
export function getIncomeLabels(transaction) {
    if (!transaction || !transaction.length) return [];
    
    // Filter only income transactions
    const incomeTransactions = transaction.filter(t => t.type === 'Income');
    
    return getLabels(incomeTransactions);
}

// Generate chart data
export function chart_Data(transaction, custom) {
    if (!transaction || !transaction.length) {
        // Return empty chart data
        return {
            data: {
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    hoverOffset: 4,
                    borderRadius: 30,
                    spacing: 10
                }]
            },
            options: {
                cutout: 115
            }
        };
    }

    let bg = _.map(transaction, a => a.color);
    bg = _.uniq(bg);
    let dataValue = getSum(transaction);

    const config = {
        data: {
            datasets: [{
                data: dataValue,
                backgroundColor: bg,
                hoverOffset: 4,
                borderRadius: 30,
                spacing: 10
            }]
        },
        options: {
            cutout: 115
        }
    };

    return custom ?? config;
}

// Generate income chart data
export function income_chart_Data(transaction, custom) {
    if (!transaction || !transaction.length) return chart_Data([], custom);
    
    // Filter only income transactions
    const incomeTransactions = transaction.filter(t => t.type === 'Income');
    
    // If there's no income data, return empty chart
    if (incomeTransactions.length === 0) return chart_Data([], custom);
    
    // Generate unique shades of green for income
    const greenShades = [
        '#10b981', // emerald-500
        '#059669', // emerald-600
        '#047857', // emerald-700
        '#065f46', // emerald-800
        '#064e3b', // emerald-900
    ];
    
    let dataValue = getSum(incomeTransactions);
    
    // Create custom colors for income chart
    const customColors = [];
    for (let i = 0; i < dataValue.length; i++) {
        customColors.push(greenShades[i % greenShades.length]);
    }
    
    const config = {
        data: {
            datasets: [{
                data: dataValue,
                backgroundColor: customColors,
                hoverOffset: 4,
                borderRadius: 30,
                spacing: 10
            }]
        },
        options: {
            cutout: 115
        }
    };

    return custom ?? config;
}

// Get total sum
export function getTotal(transaction) {
    if (!transaction || !transaction.length) return 0;
    return _.sum(getSum(transaction));
}

// Get income total only
export function getIncomeTotal(transaction) {
    if (!transaction || !transaction.length) return 0;
    
    // Filter only income transactions
    const incomeTransactions = transaction.filter(t => t.type === 'Income');
    
    return getTotal(incomeTransactions);
}