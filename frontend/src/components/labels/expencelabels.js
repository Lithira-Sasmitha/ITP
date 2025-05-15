import React from 'react';
import { default as api } from '../../store/apiSLice';
import {getLabels} from '../../components/helper/helper';

export default function Labels() {
    const { data, isFetching, isSuccess, isError } = api.useGetLabelsQuery();
    let Transactions;

    if (isFetching) {
        Transactions = <div>Fetching</div>;
    } else if (isSuccess) {
        console.log(getLabels(data,'type'))
        Transactions = getLabels(data,'type').map((v, i) => <LabelComponent key={i} data={v} />);
    } else if (isError) {
        Transactions = <div>Error</div>;
    }

    return (
        <div className='flex-1 overflow-auto relative z-10'>
        <>
            {Transactions}
        </>
        </div>
    );
}

function LabelComponent({ data }) {
    if (!data) return <></>;
    return (
        <div className="flex-1 overflow-auto relative z-10 space-y-2">
        <div className="label flex justify-between items-center py-2">
         <div className="flex items-center gap-2">
        <div
            className="w-2 h-2 rounded"
            style={{ background: data.color ?? "#f9c74f" }}
        ></div>
      <h3 className="text-md">{data.type ?? ""}</h3>
    </div>
        <h3 className="font-bold">{Math.round(data.percent) ?? 0}%</h3>
  </div>
</div>

    );
}
