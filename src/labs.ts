export interface Lab {
  name: string;
  branch: string;
  address: string;
  discount: string;
  lat: number;
  lng: number;
}

export const labs: Lab[] = [
  { name: "معمل البرج", branch: "المعادي", address: "شارع 9، المعادي، القاهرة", discount: "20%", lat: 29.9602, lng: 31.2569 },
  { name: "معمل المختبر", branch: "مدينة نصر", address: "شارع عباس العقاد، مدينة نصر", discount: "25%", lat: 30.0566, lng: 31.3656 },
  { name: "Cairo Scan", branch: "التجمع الخامس", address: "التجمع الخامس، القاهرة الجديدة", discount: "20%", lat: 30.0165, lng: 31.4973 },
  { name: "معمل البرج", branch: "وسط البلد", address: "شارع شامبليون، وسط البلد", discount: "15%", lat: 30.0444, lng: 31.2357 },
  { name: "معمل المختبر", branch: "الدقي", address: "شارع التحرير، الدكي", discount: "25%", lat: 30.0626, lng: 31.2003 },
  { name: "Cairo Scan", branch: "المعادي", address: "شارع 231، المعادي", discount: "20%", lat: 29.9555, lng: 31.2704 },
];
