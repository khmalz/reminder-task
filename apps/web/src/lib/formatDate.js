const formatDate = dateString => {
   if (!dateString) return "-";
   const d = new Date(dateString);
   if (isNaN(d.getTime())) return dateString;
   const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
   return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
};

export default formatDate;
