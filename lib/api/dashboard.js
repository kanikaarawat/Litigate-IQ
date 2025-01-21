export const fetchUser = async () => {
  try {
    const response = await fetch('https://dummy-backend-15jt.onrender.com/user');
    
    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }

    const data = await response.json();
    console.log("User Data:", data);

    return data.name || "Guest";
  } catch (error) {
    console.error("Error fetching user details:", error);
    return "Guest";
  }
};

export const fetchDashboardStats = async () => {
  try {
    const response = await fetch('https://dummy-backend-15jt.onrender.com/dashboard/stats');
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    const data = await response.json();
    console.log("Dashboard Stats:", data);

    return {
      totalCases: data.totalCases || 0,
      totalCasesChange: data.totalCasesChange || 0,
      pendingCases: data.pendingCases || 0,
      pendingCasesChange: data.pendingCasesChange || 0,
      overduePendingCasesCount: data.overduePendingCasesCount || 0,
      resolvedCases: data.resolvedCases || 0,
      resolvedCasesChange: data.resolvedCasesChange || 0,
      upcomingDeadlines: data.upcomingDeadlines || 0,
      totalCasesDetails: data.totalCasesDetails || [],
      pendingCasesDetails: data.pendingCasesDetails || [],
      overduePendingCasesDetails: data.overduePendingCasesDetails || [],
      resolvedCasesDetails: data.resolvedCasesDetails || [],
      upcomingDeadlineDetails: data.upcomingDeadlineDetails || [],
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
};

export const fetchNotifications = async () => {
  try {
    const response = await fetch('https://dummy-backend-15jt.onrender.com/dashboard/notifications');
    
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    const data = await response.json();
    console.log("Notifications Data:", data);

    return data || [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const fetchEvents = async (date) => {
  try {
    const formattedDate = date.toISOString();
    const response = await fetch(`https://dummy-backend-15jt.onrender.com/dashboard/events?date=${formattedDate}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    const data = await response.json();
    console.log(`Events Data for ${formattedDate}:`, data);

    return data || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const addEvent = async (eventData) => {
  try {
    const response = await fetch('https://dummy-backend-15jt.onrender.com/dashboard/events', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error('Failed to add event');
    }

    const newEvent = await response.json();
    console.log("New Event Added:", newEvent);

    return newEvent;
  } catch (error) {
    console.error("Error adding new event:", error);
    return null;
  }
};

export const updateEvent = async (updatedEvent) => {
  try {
    const response = await fetch(`https://dummy-backend-15jt.onrender.com/dashboard/events/${updatedEvent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    });

    if (!response.ok) {
      throw new Error(`Failed to update event with ID ${updatedEvent.id}`);
    }

    const updatedEventData = await response.json();
    console.log("Updated Event:", updatedEventData);

    return updatedEventData;
  } catch (error) {
    console.error("Error updating event:", error);
    return null;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(`https://dummy-backend-15jt.onrender.com/dashboard/events/${eventId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete event with ID ${eventId}`);
    }

    console.log(`Event with ID ${eventId} deleted successfully`);

    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
};
