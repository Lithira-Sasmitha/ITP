import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import { getTotal } from '../helper/helper';
import { default as api } from '../../store/apiSLice';

Chart.register(ArcElement);

// Modified chart data function to only use green colors for income
const income_chart_Data = (data) => {
  // Filter only income transactions
  const incomeData = data.filter(v => v.type === 'Income');
  
  // Create single color gradient for income
  const colorShades = [
    '#10b981', // emerald-500
    '#059669', // emerald-600
    '#047857', // emerald-700
    '#065f46', // emerald-800
    '#064e3b', // emerald-900
  ];
  
  let i = 0;
  const bgColor = incomeData.map(() => {
    return colorShades[i++ % colorShades.length];
  });

  return {
    data: {
      datasets: [{
        data: incomeData.map(v => v.amount),
        backgroundColor: bgColor,
        hoverOffset: 4,
        borderRadius: 30,
        spacing: 10
      }],
      labels: incomeData.map(v => v.name)
    },
    options: {
      cutout: 115,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.chart.getDatasetMeta(0).total;
              const percentage = (value * 100 / total).toFixed(2) + '%';
              return `${label}: $${value} (${percentage})`;
            }
          }
        }
      }
    }
  };
};

// Get total of only income transactions
const getIncomeTotal = (data) => {
  if (!data) return 0;
  const incomeData = data.filter(v => v.type === 'Income');
  return incomeData.reduce((prev, curr) => prev + curr.amount, 0);
};

// Income Labels component specifically for income transactions
function IncomeLabels({data}) {
  if (!data) return <></>;
  
  // Filter only income transactions
  const incomeData = data.filter(v => v.type === 'Income');
  
  if (incomeData.length === 0) {
    return <div className="text-center text-gray-400">No income transactions found</div>;
  }

  return (
    <>
      {incomeData.map((v, i) => (
        <div className="flex justify-between mb-2" key={i}>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded py-3" style={{ background: `#10b981` }}></div>
            <h3 className="text-md">{v.name ?? ''}</h3>
          </div>
          <span className="text-green-400 font-bold">${v.amount ?? 0}</span>
        </div>
      ))}
    </>
  );
}

export default function IncomeChart() {
  const { data, isFetching, isSuccess, isError } = api.useGetLabelsQuery();

  let graphData;
  
  if (isFetching) {
    graphData = <div>Fetching...</div>;
  } else if (isSuccess) {
    // Filter only income data before passing to chart
    const incomeData = data.filter(v => v.type === 'Income');
    
    if (incomeData.length === 0) {
      graphData = <div className="text-center text-gray-400 py-10">No income data to display</div>;
    } else {
      graphData = <Doughnut {...income_chart_Data(data)}></Doughnut>;
    }
  } else if (isError) {
    graphData = <div>Error loading income data</div>;
  }

  return (
    <div className="flex justify-center max-w-xs mx-auto">
      <div className="item relative">
        <div className="chart relative">
          {graphData}
          
          {/* Centered Total Value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h3 className="mb-2 font-bold text-lg">Total Income</h3>
            <span className="text-3xl font-bold text-green-400">
              ${getIncomeTotal(data) ?? 0}
            </span>
          </div>
        </div>
        
        {/* Labels Section - Only showing income transactions */}
        <div className="flex flex-col py-10 gap-4">
          <IncomeLabels data={data} />
        </div>
      </div>
    </div>
  );
}