import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const PerformanceCharts = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [maintenanceChartData, setMaintenanceChartData] = useState({
    labels: [],
    datasets: []
  });
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
      // Obtener datos de inventario
      const inventoryResponse = await axios.get(`${apiUrl}/api/v1/inventories`);
      const inventoryData = inventoryResponse.data;
      const totalPrice = inventoryData.reduce((sum, item) => sum + item.price, 0);

      // Obtener datos de clientes
      const clientsResponse = await axios.get(`${apiUrl}/api/v1/clients`);
      const clientsData = clientsResponse.data;
      const totalClientsCount = clientsData.filter(client => client.idClient).length;

      setChartData({
        labels: ['Precio Total Del Inventario'],
        datasets: [
          {
            label: 'Precio Total',
            data: [totalPrice],
            backgroundColor: ['rgba(75, 192, 192, 0.6)'],
            borderColor: ['rgba(75, 192, 192, 1)'],
            borderWidth: 1
          }
        ]
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

      // Procesar datos para obtener costos mensuales
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
            label: 'Costos Mensuales de Mantenimiento',
            data,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
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
      const totalSuppliersCount = suppliersData.filter(supplier => supplier.id_supplier).length;
      setTotalSuppliers(totalSuppliersCount);
    } catch (error) {
      setError('Error al cargar los datos de proveedores');
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Cargando datos...</p>;
  if (error) return <p className="text-center mt-5 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Gráficas de Rendimiento</h2>
      <div className="bg-white p-4 rounded shadow-md">
        <div style={{ width: '100%', height: '400px' }}>
          <Bar data={chartData} />
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow-md mt-6">
        <h2 className="text-2xl font-bold mb-4">Costos Mensuales de Mantenimiento</h2>
        <div style={{ width: '100%', height: '400px' }}>
          <Bar data={maintenanceChartData} />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-semibold">Total Clientes</h3>
          <p className="text-2xl font-bold">{totalClients}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-semibold">Total Proveedores</h3>
          <p className="text-2xl font-bold">{totalSuppliers}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-semibold">Total Mantenimientos</h3>
          <p className="text-2xl font-bold">{totalMaintenance}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <h3 className="text-lg font-semibold">Costo Total de Mantenimientos</h3>
          <p className="text-2xl font-bold">${totalMaintenanceCost}</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;
