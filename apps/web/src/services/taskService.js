const BASE_URL = "http://localhost:3000";

const getHeaders = () => {
   const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
   return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
   };
};

const handleResponse = async (res, defaultErrorMessage) => {
   if (res.status === 401) {
      if (typeof window !== "undefined") {
         localStorage.removeItem("token");
         localStorage.removeItem("userInfo");
      }
      throw new Error("401: Sesi Anda telah berakhir. Silakan login kembali.");
   }
   if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.message || defaultErrorMessage;
      throw new Error(Array.isArray(message) ? message.join(", ") : message);
   }
   if (res.status === 204) return true;
   return await res.json();
};

export const getTasks = async () => {
   try {
      const res = await fetch(`${BASE_URL}/tasks`, {
         method: "GET",
         headers: getHeaders(),
      });
      return await handleResponse(res, "Gagal mengambil daftar tugas");
   } catch (error) {
      console.error("Error in getTasks service:", error);
      throw error;
   }
};

export const createTask = async (taskData) => {
   try {
      const res = await fetch(`${BASE_URL}/tasks`, {
         method: "POST",
         headers: getHeaders(),
         body: JSON.stringify({
            title: taskData.title,
            categoryIds: taskData.categoryIds || [],
            dueDateAt: taskData.dueDateAt || taskData.deadline,
         }),
      });
      return await handleResponse(res, "Gagal menambah tugas baru");
   } catch (error) {
      console.error("Error in createTask service:", error);
      throw error;
   }
};

export const updateTask = async (taskId, taskData) => {
   try {
      const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
         method: "PATCH",
         headers: getHeaders(),
         body: JSON.stringify({
            title: taskData.title,
            categoryIds: taskData.categoryIds || [],
            dueDateAt: taskData.dueDateAt || taskData.deadline,
         }),
      });
      return await handleResponse(res, "Gagal memperbarui informasi tugas");
   } catch (error) {
      console.error("Error in updateTask service:", error);
      throw error;
   }
};

export const toggleCompleteTask = async (taskId) => {
   try {
      const res = await fetch(`${BASE_URL}/tasks/${taskId}/toggle-completed`, {
         method: "PATCH",
         headers: getHeaders(),
      });
      return await handleResponse(res, "Gagal mengubah status penyelesaian tugas");
   } catch (error) {
      console.error("Error in toggleCompleteTask service:", error);
      throw error;
   }
};

export const deleteTask = async (taskId) => {
   try {
      const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
         method: "DELETE",
         headers: getHeaders(),
      });
      return await handleResponse(res, "Gagal menghapus tugas");
   } catch (error) {
      console.error("Error in deleteTask service:", error);
      throw error;
   }
};
