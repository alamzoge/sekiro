const CACHE_NAME = 'sekiro-cache-v1';

// 1. تثبيت التطبيق والعمل في الخلفية
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// 2. المزامنة في الخلفية (Background Sync) - الصورة التي أرسلتها
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-messages') {
        event.waitUntil(
            // هنا يتم إرسال الرسائل المعلقة عندما يعود الإنترنت
            console.log('تمت المزامنة في الخلفية بنجاح وعودة الإنترنت!')
        );
    }
});

// 3. استقبال الإشعارات والتطبيق مغلق (Push Notifications)
self.addEventListener('push', function(event) {
    // استقبال البيانات من السيرفر
    const payload = event.data ? event.data.json() : { title: 'SEKIRO', body: 'لديك رسالة جديدة!' };
    
    const options = {
        body: payload.body,
        icon: '12345.jpg',
        badge: '12345.jpg',
        vibrate: [200, 100, 200, 100, 200], // اهتزاز مميز
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        },
        requireInteraction: true // يبقى الإشعار حتى يضغط عليه المستخدم
    };

    event.waitUntil(
        self.registration.showNotification(payload.title, options)
    );
});

// 4. ماذا يحدث عند الضغط على الإشعار؟
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then( windowClients => {
            // إذا كان التطبيق مفتوحاً في الخلفية، قم بالتركيز عليه
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // إذا كان مغلقاً تماماً، قم بفتحه
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
