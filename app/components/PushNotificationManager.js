// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { subscribeUser, unsubscribeUser, sendNotification } from '../actions/Actions';

// /**
//    * Converts a base64 string to a Uint8Array for use in push notifications.
//    * 
//    * @param {string} base64String The base64-encoded string.
//    * @returns {Uint8Array} The converted Uint8Array.
//    * @throws {Error} If the base64String is undefined.
//    */
// function urlBase64ToUint8Array(base64String) {
//   if (!base64String) {
//     throw new Error('The base64String is not defined.');
//   }

// //   // Ensure this runs only in the browser
// //   if (typeof window === 'undefined') {
// //     return null;
// //   }

// //   const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
// //   const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

// //   const rawData = window.atob(base64);
// //   const outputArray = new Uint8Array(rawData.length);

// //   for (let i = 0; i < rawData.length; ++i) {
// //     outputArray[i] = rawData.charCodeAt(i);
// //   }
// //   return outputArray;
// // }

// // const applicationServerKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) : null;

// /**
//  * PushNotificationManager component manages user subscriptions to push notifications and handles sending test notifications.
//  * It registers a service worker and allows the user to subscribe, unsubscribe, and send test notifications.
//  * 
//  * @returns {JSX.Element} The component JSX element.
//  */
// export default function PushNotificationManager() {
//   const [isSupported, setIsSupported] = useState(false);
//   const [subscription, setSubscription] = useState(null);
//   const [message, setMessage] = useState('');

// //   useEffect(() => {
// //     if ('serviceWorker' in navigator && 'PushManager' in window) {
// //       setIsSupported(true);
// //       registerServiceWorker();
// //     }
// //   }, []);

//   /**
//    * Registers the service worker and retrieves the current push subscription.
//    */
//   async function registerServiceWorker() {
//     const registration = await navigator.serviceWorker.register('/Service-Worker.js', {
//       scope: '/',
//       updateViaCache: 'none',
//     });
//     const sub = await registration.pushManager.getSubscription();
//     setSubscription(sub);
//   }

//   /**
//    * Subscribes the user to push notifications.
//    */
//   async function subscribeToPush() {
//     const registration = await navigator.serviceWorker.ready;
//     const sub = await registration.pushManager.subscribe({
//       userVisibleOnly: true,
//       applicationServerKey,
//     });
//     setSubscription(sub);
//     await subscribeUser(sub);
//   }

//   /**
//    * Unsubscribes the user from push notifications.
//    */
//   async function unsubscribeFromPush() {
//     if (subscription) {
//       await subscription.unsubscribe();
//       setSubscription(null);
//       await unsubscribeUser();
//     }
//   }

//   /**
//    * Sends a test notification to the subscribed user.
//    */
//   async function sendTestNotification() {
//     if (subscription) {
//       await sendNotification(message);
//       setMessage('');
//     }
//   }

//   if (!isSupported) {
//     return <p>Push notifications are not supported in this browser.</p>;
//   }

//   return (
//     <div>
//       <h3>Push Notifications</h3>
//       {subscription ? (
//         <>
//           <p>You are subscribed to push notifications.</p>
//           <button onClick={unsubscribeFromPush}>Unsubscribe</button>
//           <input
//             type="text"
//             placeholder="Enter notification message"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <button onClick={sendTestNotification}>Send Test</button>
//         </>
//       ) : (
//         <>
//           <p>You are not subscribed to push notifications.</p>
//           <button onClick={subscribeToPush}>Subscribe</button>
//         </>
//       )}
//     </div>
//   );
// }
