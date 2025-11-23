const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const conectarDB = require("./Server/Conexion");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const updateLastActivity = require('./middleware/updateLastActivity');

const app = express();

conectarDB();

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map(origin => origin.trim())
  : [];


const corsOptions = {
  origin: corsOrigins.length > 0 ? corsOrigins : false,
  // origin: "*", //🔓 Acepta cualquier origen 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
app.use(helmet.noSniff());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-scripts.com"],
      styleSrc: ["'self'", "trusted-styles.com"],
      imgSrc: ["'self'", "trusted-images.com"],
    },
  })
);


app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

app.use((req, res, next) => {
  const blockedIPs = ["169.254.169.254", "::ffff:169.254.169.254"];
  const clientIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress;

  if (blockedIPs.includes(clientIP)) {
    console.warn(`🔴 Intento de acceso bloqueado desde ${clientIP}`);
    return res.status(403).send("Acceso denegado");
  }
  next();
});


app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    }
  },
  xssFilter: true,
  frameguard: { action: "deny" },
  noSniff: true
}));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});


app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});
// RUTA DE DIAGNÓSTICO (añádela temporalmente a tu app Express)
app.post("/debug-multipart", (req, res) => {
  console.log("=== Debug Multipart ===");
  console.log("content-type:", req.headers['content-type']);
  let len = 0;
  req.on('data', chunk => { len += chunk.length; });
  req.on('end', () => {
    console.log("body-length:", len);
    res.status(200).json({ ok: true, contentType: req.headers['content-type'], bodyLength: len });
  });
});

app.use(updateLastActivity);

const apiVersion = process.env.API_VERSION || "v1";

// Rutas padres
app.use(`/api/${apiVersion}/msj`, require("./Routes/WhatsappRoute.js"));
app.use(`/api/${apiVersion}/categoria`, require('./Routes/CategoriaRoutes'));
app.use(`/api/${apiVersion}/producto`, require("./Routes/ProductRoute"));
app.use(`/api/${apiVersion}/vestido`, require("./Routes/VestidoRoute"));
app.use(`/api/${apiVersion}/accesorio`, require("./Routes/AccesorioRoute.js"));
app.use(
  `/api/${apiVersion}/vestidos-accesorios`,
  require("./Routes/VestidoAccesorioRoute.js")
);

app.use(
  `/api/${apiVersion}/notificacion`,
  require("./Routes/NotificacionRoute")
);
app.use(`/api/${apiVersion}/enviar-correo`, require("./Routes/CorreoRoute"));
app.use(`/api/${apiVersion}/verificacion`, require("./Routes/CorreoRoute"));
app.use(`/api/${apiVersion}/verificar`, require("./Routes/catpch"));
app.use(`/api/${apiVersion}/Empresa`, require("./Routes/PerfilEmpresa.Routes"));
app.use(`/api/${apiVersion}/quienesSomos`, require("./Routes/quienesSomos.routes.js"));
app.use(`/api/${apiVersion}/autentificacion`, require("./Routes/AuthRoute"));
app.use(`/api/${apiVersion}/renta`, require("./Routes/Renta&Venta"));
app.use(`/api/${apiVersion}/estadisticas`, require("./Routes/EstadisticasRoute"));
app.use(`/api/${apiVersion}/proceso`, require("./Routes/Renta&Venta"));

// ruta carrito
app.use(`/api/${apiVersion}/carrito`, require("./Routes/CarritoRoute"));

app.use(`/api/${apiVersion}/chatbot`, require("./Routes/chatbot.routes.js"));
app.use(`/api/${apiVersion}/transaccion`, require("./Routes/transactionRoutes.js"));
// ruta carrito
app.use(`/api/${apiVersion}/carrito`, require("./Routes/CarritoRoute"));
app.use(`/api/${apiVersion}/carrito`, require("./Routes/CarritoRoute"));


// Ruta para acciones control de Administrador de la página
app.use(`/api/${apiVersion}/admin`, require("./Routes/PrivadoRoute"));
app.use(`/api/${apiVersion}/politicas`, require("./Routes/PoliticasRoute.js"));
app.use(`/api/${apiVersion}/posts`, require("./Routes/socialRoutes.js"));

// Ruta para acciones con rol de Administrador
app.use(`/api/${apiVersion}/usuarios`, require("./Routes/UsuarioRoute"));

app.use((req, res, next) => {
  ["X-Powered-By", "Date"].forEach(header => res.removeHeader(header));
  next();
});


module.exports = app;
