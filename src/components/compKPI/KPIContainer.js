import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar} from 'react-chartjs-2';
import 'chart.js/auto';
import { FaUsers, FaTruck, FaTools, FaDollarSign } from 'react-icons/fa';

const apiUrl = process.env.REACT_APP_API_URL;

const PerformanceCharts = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [maintenanceChartData, setMaintenanceChartData] = useState({ labels: [], datasets: [] });
  const [totalClients, setTotalClients] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalMaintenance, setTotalMaintenance] = useState(0);
  const [totalMaintenanceCost, setTotalMaintenanceCost] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    fetchMaintenanceData();
    fetchSuppliersData();
  }, []);

  const fetchData = async () => {
    try {
      const inventoryResponse = await axios.get(`${apiUrl}/api/v1/inventories`);
      const inventoryData = inventoryResponse.data;
      const totalPrice = inventoryData.reduce((sum, item) => sum + item.price, 0);

      const clientsResponse = await axios.get(`${apiUrl}/api/v1/clients`);
      const clientsData = clientsResponse.data;
      const totalClientsCount = clientsData.length;

      setChartData({
        labels: ['Inventario'],
        datasets: [
          {
            label: 'Precio Total',
            data: [totalPrice],
            backgroundColor: ['rgba(75, 192, 192, 0.8)'],
            borderColor: ['rgba(75, 192, 192, 1)'],
            borderWidth: 2,
          },
        ],
      });

      setTotalClients(totalClientsCount);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar los datos');
      setLoading(false);
    }
  };

  const fetchMaintenanceData = async () => {
    try {
      const maintenanceResponse = await axios.get(`${apiUrl}/api/v1/maintenance`);
      const maintenanceData = maintenanceResponse.data;

      const monthlyCosts = {};
      let totalCost = 0;

      maintenanceData.forEach(item => {
        const date = new Date(item.realizationDate);
        const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!monthlyCosts[month]) {
          monthlyCosts[month] = 0;
        }
        monthlyCosts[month] += item.cost;
        totalCost += item.cost;
      });

      const labels = Object.keys(monthlyCosts).sort();
      const data = labels.map(label => monthlyCosts[label]);

      setMaintenanceChartData({
        labels,
        datasets: [
          {
            label: 'Costos Mensuales',
            data,
            backgroundColor: 'rgba(255, 159, 64, 0.8)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 2,
          },
        ],
      });

      setTotalMaintenance(maintenanceData.length);
      setTotalMaintenanceCost(totalCost);
    } catch (error) {
      setError('Error al cargar los datos de mantenimiento');
      setLoading(false);
    }
  };

  const fetchSuppliersData = async () => {
    try {
      const suppliersResponse = await axios.get(`${apiUrl}/api/v1/suppliers`);
      const suppliersData = suppliersResponse.data;
      setTotalSuppliers(suppliersData.length);
    } catch (error) {
      setError('Error al cargar los datos de proveedores');
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Cargando datos...</p>;
  if (error) return <p className="text-center mt-5 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-iosText dark:text-white mb-6">Panel de KPI</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { icon: FaUsers, label: 'Clientes', value: totalClients, color: 'bg-blue-500' },
          { icon: FaTruck, label: 'Proveedores', value: totalSuppliers, color: 'bg-green-500' },
          { icon: FaTools, label: 'Mantenimientos', value: totalMaintenance, color: 'bg-red-500' },
          { icon: FaDollarSign, label: 'Costo Total', value: `$${totalMaintenanceCost}`, color: 'bg-yellow-500' },
        ].map(({ icon: Icon, label, value, color }, index) => (
          <div key={index} className={`p-4 ${color} text-white rounded shadow flex items-center`}>
            <Icon className="text-4xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold">{label}</h3>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h3 className="text-xl font-bold mb-4">Precio Total del Inventario</h3>
        <div style={{ width: '100%', height: '400px' }}>
          <Bar data={chartData} />
        </div>
      </div>
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-bold mb-4">Costos de Mantenimiento Mensuales</h3>
        <div style={{ width: '100%', height: '400px' }}>
          <Bar data={maintenanceChartData} />
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;
