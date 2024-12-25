import React, { useEffect, useState } from 'react';
import axios from 'axios';
import KPICard from './KPICard';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);


const KPIContainer = () => {
  const [kpis, setKpis] = useState([]);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/inventories`);
        setKpis(response.data);
      } catch (error) {
        console.error('Error fetching KPI data:', error);
      }
    };

    fetchKPIs();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {kpis.map((kpi) => (
        <KPICard
          key={kpi.pice}
          title={kpi.title}
          value={kpi.value}
          description={kpi.description}
        />
      ))}
    </div>
  );
};

export default KPIContainer;
