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
         window.location.href = "/login";
      }
      throw new Error("401: Sesi Anda telah berakhir. Silakan login kembali.");
   }
   if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.message || defaultErrorMessage;
      throw new Error(Array.isArray(message) ? message.join(", ") : message);
   }
   return await res.json();
};

export const getPomodoroLogs = async (taskId = null) => {
   try {
      const url = taskId ? `${BASE_URL}/pomodoro?taskId=${taskId}` : `${BASE_URL}/pomodoro`;
      const res = await fetch(url, {
         method: "GET",
         headers: getHeaders(),
      });
      return await handleResponse(res, "Gagal mengambil riwayat Pomodoro");
   } catch (error) {
      console.error("Error in getPomodoroLogs service:", error);
      throw error;
   }
};

export const createPomodoroLog = async (pomodoroData) => {
   try {
      const res = await fetch(`${BASE_URL}/pomodoro`, {
         method: "POST",
         headers: getHeaders(),
         body: JSON.stringify({
            durationMinutes: pomodoroData.durationMinutes,
            startedAt: pomodoroData.startedAt,
            endedAt: pomodoroData.endedAt,
            taskId: pomodoroData.taskId || null,
         }),
      });
      return await handleResponse(res, "Gagal menyimpan sesi Pomodoro");
   } catch (error) {
      console.error("Error in createPomodoroLog service:", error);
      throw error;
   }
};
