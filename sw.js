self.addEventListener('push', function(event){
  const data = event.data ? event.data.json() : {title:"كوموند جديد فطريقك!", body:"عندك كوموند قريب قابل للنقاش"};
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
      vibrate: [200,100,200,100,200],
      sound: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
      data: {url: '/Livery-way/livreur.html'},
      actions: [
        {action:'accept', title:'✅ قبلت'},
        {action:'negotiate', title:'💬 ناقش الثمن'}
      ],
      requireInteraction: true
    })
  );
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  if(event.action === 'accept'){
    event.waitUntil(clients.openWindow('/Livery-way/livreur.html?action=accept'));
  } else if(event.action === 'negotiate'){
    event.waitUntil(clients.openWindow('/Livery-way/livreur.html?action=negotiate'));
  } else {
    event.waitUntil(clients.openWindow('/Livery-way/livreur.html'));
  }
});

// للتجربة المحلية - كل 5 ثواني يقلب
self.addEventListener('periodicsync', (event)=>{
  if(event.tag === 'check-orders'){
    event.waitUntil(checkOrders());
  }
});
