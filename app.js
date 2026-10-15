const map = L.map('map').setView([31.634, -8.015], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let طلبيات = [
  {id:1, اسم:"جليز - البداية", lat:31.632, lng:-8.008},
  {id:2, اسم:"أمرشيش", lat:31.665, lng:-8.015},
  {id:3, اسم:"سيدي يوسف", lat:31.611, lng:-7.979},
  {id:4, اسم:"المسيرة", lat:31.628, lng:-8.055}
];

let خط_الطريق = null;

function جمع_الطلبيات() {
  fetch(`https://router.project-osrm.org/route/v1/driving/${طلبيات.map(t=>`${t.lng},${t.lat}`).join(';')}?overview=full&geometries=geojson`)
  .then(r=>r.json())
  .then(data=>{
    const بعد = (data.routes[0].distance/1000).toFixed(1);
    const قبل = 12;
    const وفر = (قبل - بعد).toFixed(1);
    const نسبة = Math.round((وفر/قبل)*100);
    
    document.querySelector('#before').innerText = قبل + ' km';
    document.querySelector('#after').innerText = بعد + ' km';
    document.querySelector('#saved').innerText = وفر + ' km - ' + نسبة + '%';
    
    if(خط_الطريق) map.removeLayer(خط_الطريق);
    خط_الطريق = L.geoJSON(data.routes[0].geometry, {style:{color:'#00b894',weight:6}}).addTo(map);
    طلبيات.forEach(t=>{
      L.marker([t.lat, t.lng]).addTo(map).bindPopup(`<b>${t.اسم}</b>`);
    });
  });
}

function ارسل_لليفور() {
  const طريق = `https://www.google.com/maps/dir/${طلبيات.map(t=>`${t.lat},${t.lng}`).join('/')}`;
  const رسالة = `الطريق المجمعة - وفر ${document.querySelector('#saved').innerText}: ${طريق}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(رسالة)}`, '_blank');
}
window.onload = جمع_الطلبيات;
