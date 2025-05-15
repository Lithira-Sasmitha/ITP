import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import Labels from '../labels/expencelabels'; 
import { chart_Data, getTotal } from '../helper/helper';
import { default as api } from '../../store/apiSLice';

Chart.register(ArcElement); 

export default function ExpenceChart() {
  
  const { data, isFetching, isSuccess, isError } = api.useGetLabelsQuery();
  let graphData;

  
  if (isFetching) {
    graphData = <div>Fetching...</div>;
  } else if (isSuccess) {
    graphData = <Doughnut {...chart_Data(data)}></Doughnut>;
  } else if (isError) {
    graphData = <div>Error loading chart data</div>;
  }

  return (
    <div className="flex justify-center max-w-xs mx-auto">
  <div className="item relative">
    <div className="chart relative">
      
      {graphData}

      {/* Centered Total Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h3 className="mb-2 font-bold text-black text-lg">Total</h3>
        <span className="text-3xl font-bold text-emerald-400">
          ${getTotal(data) ?? 0}
        </span>
      </div>

    </div>

    {/* Labels Section */}
    <div className="flex flex-col py-10 gap-4">
      <Labels />
    </div>
  </div>
</div>

  );
}
