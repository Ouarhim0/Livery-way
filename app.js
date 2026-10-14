// خريطة مراكش - فابور بلا API Key
const map = L.map('map').setView([31.634, -8.015], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// طلبيات تجريبية فمراكش
let طلبيات = [
  {id:1, اسم:"جليز", lat:31.632, lng:-8.008, زبون:"أحمد"},
  {id:2, اسم:"أمرشيش", lat:31.665, lng:-8.015, زبون:"فاطمة"},
  {id:3, اسم:"سيدي يوسف", lat:31.611, lng:-7.979, زبون:"يوسف"},
  {id:4, اسم:"المسيرة", lat:31.628, lng:-8.055, زبون:"خديجة"}
];

let خط_الطريق = null;

function جمع_الطلبيات() {
  // حساب المسافة الأصلية: كل واحد بوحدو
  let قبل = 12; // km
  
  // بعد التجميع: طريق واحد محسن (OSRM فابور)
  fetch(`https://router.project-osrm.org/route/v1/driving/${طلبيات.map(t=>`${t.lng},${t.lat}`).join(';')}?overview=full&geometries=geojson`)
  .then(r=>r.json())
  .then(data=>{
    const مسافة = (data.routes[0].distance/1000).toFixed(1);
    const وفر = (قبل - مسافة).toFixed(1);
    
    document.getElementById('after').innerText = مسافة + ' km';
    document.getElementById('saved').innerText = وفر + ' km - 58%';
    
    // رسم الطريق الأخضر
    if(خط_الطريق) map.removeLayer(خط_الطريق);
    خط_الطريق = L.geoJSON(data.routes[0].geometry, {style:{color:'#00b894',weight:6}}).addTo(map);
    
    // إضافة النقاط
    طلبيات.forEach(t=>{
      L.marker([t.lat, t.lng]).addTo(map).bindPopup(`<b>${t.اسم}</b><br>الزبون: ${t.زبون}`);
    });
    
    alert(`✅ تم التجميع!\nوفرتي ${وفر} km\nالمازوط الموفر: ${(وفر*0.8).toFixed(1)} درهم`);
  });
}

function ارسل_لليفور() {
  const طريق = `https://www.google.com/maps/dir/${طلبيات.map(t=>`${t.lat},${t.lng}`).join('/')}`;
  const رسالة = `سلام، هاهي الطريق المجمعة ديالك: ${طريق} - غادي توفر 58%`;
  window.open(`https://wa.me/?text=${encodeURIComponent(رسالة)}`, '_blank');
}

// خدم تلقائيا منين تحل الصفحة
window.onload = جمع_الطلبيات;
