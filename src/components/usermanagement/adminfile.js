import React, { useState, useEffect } from "react";
import { Header } from "./../propertylistingpage/Header";
import { SideBar } from "./../propertylistingpage/SideBar";
import { Search, ChevronDown, Check } from "react-feather";
import { fetchUsersAndRoles,updateUserRecord } from "../../services/newapiServices";
export default function AdminFile() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [editingUser, setEditingUser] = useState(null);
  const [tempChanges, setTempChanges] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { users: fetchedUsers, roles: fetchedRoles, error } = await fetchUsersAndRoles();
      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const roleMap = fetchedRoles.reduce((acc, role) => {
        acc[role.id] = role.role;
        return acc;
      }, {});

      const enrichedUsers = fetchedUsers.map((user) => ({
        ...user,
        role: roleMap[user.role_id] || 'Unknown',
      }));

      setUsers(enrichedUsers);
      setRoles(fetchedRoles);
    };

    fetchData();
  }, []);

  const handleRowSelect = (userId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
      setEditingUser(null);
      setTempChanges((prev) => {
        const { [userId]: _, ...rest } = prev;
        return rest;
      });
    } else {
      newSelected.add(userId);
      setEditingUser(userId);
    }
    setSelectedRows(newSelected);
  };

  const handleChange = (userId, field, value) => {
    setTempChanges((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: value },
    }));
  };

  const handleSaveChanges = async (userId) => {
    if (tempChanges[userId]) {
      try {
        const roleId = tempChanges[userId]?.role
          ? roles.find((role) => role.role === tempChanges[userId].role)?.id
          : users.find((user) => user.id === userId)?.role_id;

        const rstatus = tempChanges[userId]?.rstatus ?? users.find((user) => user.id === userId)?.rstatus;

        if (roleId === undefined && rstatus === undefined) {
          console.error('Invalid input.');
          return;
        }

        const result = await updateUserRecord(userId, roleId, rstatus);

        if (result.success) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId
                ? {
                    ...user,
                    role_id: roleId ?? user.role_id,
                    role: tempChanges[userId]?.role || user.role,
                    rstatus: rstatus ?? user.rstatus,
                  }
                : user
            )
          );

          setTempChanges((prev) => {
            const { [userId]: _, ...rest } = prev;
            return rest;
          });

          setEditingUser(null);
          setSelectedRows((prev) => {
            const newSelected = new Set(prev);
            newSelected.delete(userId);
            return newSelected;
          });
        } else {
          console.error('Error:', result.error);
        }
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(user.id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 ml-64">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Management</h2>

            <div className="mb-6">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rstatus</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={selectedRows.has(user.id) ? "bg-blue-50" : "hover:bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(user.id)}
                          onChange={() => handleRowSelect(user.id)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.user_name || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser === user.id ? (
                          <div className="relative inline-block w-40">
                            <select
                              value={tempChanges[user.id]?.role || user.role}
                              onChange={(e) => handleChange(user.id, "role", e.target.value)}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                            >
                              <option value="">Select Role</option>
                              {roles.map((role) => (
                                <option key={role.id} value={role.role}>
                                  {role.role.toUpperCase()}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {user.role || "N/A"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser === user.id ? (
                          <div className="relative inline-block w-40">
                            <select
                              value={tempChanges[user.id]?.rstatus ?? user.rstatus}
                              onChange={(e) => handleChange(user.id, "rstatus", e.target.value)}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                            >
                              <option value="">Select Rstatus</option>
                              <option value="0">0</option>
                              <option value="1">1</option>
                            </select>
                          </div>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {user.rstatus}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {selectedRows.has(user.id) && editingUser === user.id && (
                          <button
                            onClick={() => handleSaveChanges(user.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
