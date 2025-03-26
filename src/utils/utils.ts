export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`);
    return response.json();
  },
  post: async <T>(endpoint: string, data: T) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  },
  delete: async <T>(endpoint: string, data?: T) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      body: JSON.stringify(data)
    });
    return response.json();
  }
};