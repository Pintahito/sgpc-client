import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const MaintenanceForm = () => {
  const [formData, setFormData] = useState({
    relatedEntityId: 0,
    relatedEntityType: 'VEHICLE',
    employeeId: 0,
    maintenanceType: '',
    description: '',
    cost: 0,
    realizationDate: '',
    nextDate: ''
  });

  const [employees, setEmployees] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get(`${apiUrl}/api/v1/employees`)
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Error fetching employees:', error));

    axios.get(`${apiUrl}/api/v1/maintenance`)
      .then(response => setMaintenances(response.data))
      .catch(error => console.error('Error fetching maintenances:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    try {
      if (editId) {
        await axios.put(`${apiUrl}/api/v1/maintenance/${editId}`, formData);
        alert('Maintenance record updated successfully');
      } else {
        await axios.post(`${apiUrl}/api/v1/maintenance`, formData);
        alert('Maintenance record added successfully');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error saving maintenance record:', error);
    }
  };

  const handleEdit = (id) => {
    const record = maintenances.find(item => item.id === id);
    setFormData(record);
    setEditId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/v1/maintenance/${id.idMaintenance}`);
      alert('Maintenance record deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
    }
  };

  return (
    <div className="space-y-8 p-4">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow-md">
        <label>
          Related Entity Type:
          <select name="relatedEntityType" value={formData.relatedEntityType} onChange={handleChange}>
            <option value="VEHICLE">Vehicle</option>
            <option value="MACHINARY">Machinery</option>
          </select>
        </label>
        <label>
          Related Entity ID:
          <input type="number" name="relatedEntityId" value={formData.relatedEntityId} onChange={handleChange} />
        </label>
        <label>
          Employee:
          <select name="employeeId" value={formData.employeeId} onChange={handleChange}>
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.idEmployee} value={emp.idEmployee}>{emp.name}</option>
            ))}
          </select>
        </label>
        <label>
          Maintenance Type:
          <input type="text" name="maintenanceType" value={formData.maintenanceType} onChange={handleChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
        </label>
        <label>
          Cost:
          <input type="number" name="cost" value={formData.cost} onChange={handleChange} />
        </label>
        <label>
          Realization Date:
          <input type="date" name="realizationDate" value={formData.realizationDate} onChange={handleChange} />
        </label>
        <label>
          Next Date:
          <input type="date" name="nextDate" value={formData.nextDate} onChange={handleChange} />
        </label>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editId ? 'Update Maintenance' : 'Save Maintenance'}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Employee</th>
              <th className="border px-4 py-2">Cost</th>
              <th className="border px-4 py-2">Descripcion</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {maintenances.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.idMaintenance}</td>
                <td className="border px-4 py-2">{item.relatedEntityType}</td>
                <td className="border px-4 py-2">{item.nameEmployee}</td>
                <td className="border px-4 py-2">{item.cost}</td>
                <td className="border px-4 py-2">{item.description}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(item.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceForm;
