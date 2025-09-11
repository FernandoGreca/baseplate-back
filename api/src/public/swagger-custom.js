// window.onload = function() {
//   const ui = SwaggerUIBundle({
//     url: '/api-json',
//     dom_id: '#swagger-ui',
//     presets: [
//       SwaggerUIBundle.presets.apis,
//       SwaggerUIStandalonePreset
//     ],
//   });

//   const oldFetch = window.fetch;
//   window.fetch = async (...args) => {
//     const response = await oldFetch(...args);
//     if (args[0].includes('/auth/login') && response.ok) {
//       const clone = response.clone();
//       clone.json().then(data => {
//         if (data.access_token) {
//           ui.preauthorizeApiKey('bearer', data.access_token);
//         }
//       });
//     }
//     return response;
//   };
// };
