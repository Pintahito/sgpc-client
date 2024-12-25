import React from 'react';

const KPICard = ({ title, value, description }) => (
  <div className="bg-white shadow-md rounded-lg p-4 text-center">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-3xl font-bold text-blue-600">{value}</p>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

export default KPICard;