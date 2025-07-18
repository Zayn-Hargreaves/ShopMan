const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Client API",
      version: "1.0.0",
      description: "API documentation for Client Services",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    "./src/routes/client/auth/index.js",
    "./src/routes/client/index.js",
    "./src/routes/client/user/index.js",
    "./src/routes/client/product/index.js",
    "./src/routes/admin/product/index.js",
    "./src/routes/client/category/index.js",
    "./src/routes/client/banner/index.js",
    "./src/routes/client/campaign/index.js",
    "./src/routes/client/comment/index.js",
    "./src/routes/client/cart/index.js",
    "./src/routes/client/checkout/index.js",
    "./src/routes/client/wishlist/index.js",
    "./src/routes/client/paymentMethod/index.js",
    "./src/routes/client/notification/index.js",
    "./src/routes/client/shop/index.js",
    "./src/routes/admin/shop/index.js",
    "./src/routes/admin/member/index.js",
    "./src/routes/client/order/index.js",
    "./src/routes/admin/order/index.js",
    "./src/routes/client/wishlist/index.js",
    "./src/routes/admin/inventory/index.js",
    "./src/routes/admin/index.js",
    "./src/routes/admin/campaign/index.js",
    "./src/routes/admin/discount/index.js",
    "./src/routes/admin/banner/index.js",
    "./src/routes/admin/analytics/index.js"



  ]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;