const API_BASE_URL = 'http://127.0.0.1:6543/api';

export async function fetchEvents() {
  const response = await fetch(\`\${API_BASE_URL}/events\`);
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  return response.json();
}

export async function fetchEventDetail(eventId) {
  const response = await fetch(\`\${API_BASE_URL}/events/\${eventId}\`);
  if (!response.ok) {
    throw new Error('Failed to fetch event detail');
  }
  return response.json();
}

export async function fetchParticipants(eventId) {
  const response = await fetch(\`\${API_BASE_URL}/events/\${eventId}/participants\`);
  if (!response.ok) {
    throw new Error('Failed to fetch participants');
  }
  return response.json();
}

export async function addParticipant(eventId, participantData) {
  const response = await fetch(\`\${API_BASE_URL}/events/\${eventId}/participants\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(participantData)
  });
  if (!response.ok) {
    throw new Error('Failed to add participant');
  }
  return response.json();
}

export async function login(credentials) {
  const response = await fetch(\`\${API_BASE_URL}/login\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
}

export async function logout() {
  const response = await fetch(\`\${API_BASE_URL}/logout\`, {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error('Logout failed');
  }
  return response.json();
}

export async function register(userData) {
  const response = await fetch(\`\${API_BASE_URL}/register\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
}
