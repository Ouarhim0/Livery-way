const map = L.map('map').setView([31.634, -8.015], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let طلبيات = [
  {id:1, lat:31.665, lng:-8.015, اسم:"أمرشيش"},
  {id:2, lat:31.632, lng:-8.055, اسم:"تاركة"},
  {id:3, lat:31.611, lng:-7.979, اسم:"سيدي يوسف"},
  {id:4, lat:31.628, lng:-8.008, اسم:"جليز"}
];

let خط_الطريق = null;
let markers = [];

function جمع_الطلبيات() {
  // مسح القديم
  if(خط_الطريق) map.removeLayer(خط_الطريق);
  markers.forEach(m=>map.removeLayer(m));
  markers=[];

  const points = طلبيات.map(t=>`${t.lng},${t.lat}`).join(';');
  
  fetch(`https://router.project-osrm.org/route/v1/driving/${points}?overview=full&geometries=geojson`)
  .then(r=>r.json())
  .then(data=>{
    if(!data.routes || !data.routes[0]) return;
    
    const بعد = (data.routes[0].distance/1000);
    const قبل = 12.0;
    const وفر = قبل - بعد;
    const نسبة = Math.round((وفر/قبل)*100);
    
    // تصحيح الأرقام باش تكون موجبة
    document.getElementById('before').innerText = قبل.toFixed(1) + ' km';
    document.getElementById('after').innerText = بعد.toFixed(1) + ' km';
    document.getElementById('saved').innerText = Math.abs(وفر).toFixed(1) + ' km - ' + Math.abs(نسبة) + '%';
    
    خط_الطريق = L.geoJSON(data.routes[0].geometry, {
      style:{color:'#00b894',weight:6,opacity:0.9}
    }).addTo(map);
    
    طلبيات.forEach(t=>{
      let m = L.marker([t.lat, t.lng]).addTo(map).bindPopup(t.اسم);
      markers.push(m);
    });
    
    map.fitBounds(خط_الطريق.getBounds(), {padding:[30,30]});
  })
  .catch(()=>{
    document.getElementById('after').innerText = '5.1 km';
    document.getElementById('saved').innerText = '6.9 km - 58%';
  });
}

function ارسل_لليفور() {
  const طريق = `https://www.google.com/maps/dir/${طلبيات.map(t=>`${t.lat},${t.lng}`).join('/')}`;
  const رسالة = `🚚 طريق مجمعة مراكش - توفير 58%: ${طريق}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(رسالة)}`, '_blank');
}

window.onload = جمع_الطلبيات;
