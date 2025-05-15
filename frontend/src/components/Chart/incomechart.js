import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';
import { default as api } from '../../store/apiSLice';

// Register required Chart.js components
Chart.register(ArcElement, Tooltip);

// Modified chart data function with enhanced tooltips
const income_chart_Data = (data) => {
  // Filter only income transactions (currently using Investment as placeholder)
  const incomeData = data.filter(v => v.type === 'Investment');
  
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

  // Calculate total for percentage
  const total = incomeData.reduce((sum, item) => sum + item.amount, 0);

  return {
    data: {
      datasets: [{
        data: incomeData.map(v => v.amount),
        backgroundColor: bgColor,
        hoverOffset: 8, // Increased for better visual feedback on touch
        borderRadius: 30,
        spacing: 10
      }],
      labels: incomeData.map(v => v.name)
    },
    options: {
      cutout: 115,
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        tooltip: {
          enabled: true,
          position: 'nearest',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 16,
            weight: 'bold'
          },
          bodyFont: {
            size: 14
          },
          padding: 12,
          displayColors: true, // Show color boxes
          callbacks: {
            title: function(tooltipItems) {
              return tooltipItems[0].label || 'Unknown';
            },
            label: function(context) {
              const value = context.parsed || 0;
              const percentage = total > 0 ? (value * 100 / total).toFixed(1) + '%' : '0%';
              return [
                `Amount: $${value.toLocaleString()}`, 
                `Percentage: ${percentage}`
              ];
            }
          }
        },
        legend: {
          display: false // Hide default legend since we're creating custom labels
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true
      },
      // Improve touch interactions
      events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove']
    }
  };
};

// Get total of only income transactions
const getIncomeTotal = (data) => {
  if (!data) return 0;
  // Currently using Investment as placeholder for Income
  const incomeData = data.filter(v => v.type === 'Investment');
  return incomeData.reduce((prev, curr) => prev + curr.amount, 0);
};

// Income Labels component specifically for income transactions
function IncomeLabels({data}) {
  if (!data) return <></>;
  
  // Filter only income transactions (currently using Investment as placeholder)
  const incomeData = data.filter(v => v.type === 'Investment');
  
  if (incomeData.length === 0) {
    return <div className="text-center text-gray-400">No income transactions found</div>;
  }

  return (
    <>
      {incomeData.map((v, i) => (
        <div className="flex justify-between mb-2 p-2 hover:bg-gray-800 hover:bg-opacity-40 rounded-md transition-colors" key={i}>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 rounded-full" style={{ background: `#10b981` }}></div>
            <h3 className="text-md">{v.name ?? ''}</h3>
          </div>
          <span className="text-green-400 font-bold">${v.amount?.toLocaleString() ?? 0}</span>
        </div>
      ))}
    </>
  );
}

export default function IncomeChart() {
  const { data, isFetching, isSuccess, isError } = api.useGetLabelsQuery();

  let graphData;
  
  if (isFetching) {
    graphData = <div className="flex items-center justify-center h-40">
      <div className="animate-pulse text-green-500">Loading chart data...</div>
    </div>;
  } else if (isSuccess) {
    // Filter only income data before passing to chart (using Investment as placeholder)
    const incomeData = data.filter(v => v.type === 'Investment');
    
    if (!incomeData || incomeData.length === 0) {
      graphData = <div className="text-center text-gray-400 py-10">No income data to display</div>;
    } else {
      graphData = <Doughnut {...income_chart_Data(data)}></Doughnut>;
    }
  } else if (isError) {
    graphData = <div className="text-red-400 text-center py-10">Error loading income data</div>;
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
              ${(getIncomeTotal(data) || 0).toLocaleString()}
            </span>
          </div>
        </div>
        
       
      
      </div>
    </div>
  );
}