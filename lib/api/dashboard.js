export const fetchDashboardNotifications = async () => {
  const response = await fetch('https://dummy-backend-15jt.onrender.com/dashboard/notifications');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard notifications');
  }
  return response.json();
};