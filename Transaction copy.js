const { MongoClient } = require('mongodb');
const Mongoose = require('mongoose'); // Para usar Mongoose.Types.ObjectId

// Define tu URI de conexión a MongoDB
// ¡IMPORTANTE! Reemplaza con tu URI real.
const uri = "mongodb+srv://nico:nico123@cluster0.xa138vm.mongodb.net/bdAtr";

// IDs de usuario existentes (puedes añadir más si tienes)
const userIds = [
  {
    "_id": "67daf51df4ed8050c7b72619"
  },
  {
    "_id": "67daf757f4ed8050c7b72622"
  },
  {
    "_id": "67daf763f4ed8050c7b7262a"
  },
  {
    "_id": "67daf771f4ed8050c7b72632"
  },
  {
    "_id": "67daf77ef4ed8050c7b7263a"
  },
  {
    "_id": "67daf78df4ed8050c7b72642"
  },
  {
    "_id": "67daf7a1f4ed8050c7b7264a"
  },
  {
    "_id": "67daf7adf4ed8050c7b72652"
  },
  {
    "_id": "67daf7bff4ed8050c7b7265a"
  },
  {
    "_id": "67daf7c9f4ed8050c7b72662"
  },
  {
    "_id": "67daf7d5f4ed8050c7b7266a"
  },
  {
    "_id": "67daf7e0f4ed8050c7b72672"
  },
  {
    "_id": "67daf7ebf4ed8050c7b7267a"
  },
  {
    "_id": "67daf7f6f4ed8050c7b72682"
  },
  {
    "_id": "67daf854f4ed8050c7b7268a"
  },
  {
    "_id": "67daf8aef4ed8050c7b72692"
  },
  {
    "_id": "67daf8baf4ed8050c7b7269a"
  },
  {
    "_id": "67daf8c5f4ed8050c7b726a2"
  },
  {
    "_id": "67daf8d0f4ed8050c7b726aa"
  },
  {
    "_id": "67daf8dbf4ed8050c7b726b2"
  },
  {
    "_id": "67de3ed8b3a4e8f9bb07fad5"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d33"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d4b"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d01"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d19"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d09"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d0d"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d0b"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d11"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d2b"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d49"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d15"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d41"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d4f"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d2f"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d3b"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d29"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d3d"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d17"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d1f"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d25"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d37"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d43"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d03"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d23"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d51"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d07"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d1b"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d21"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d05"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d13"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d2d"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d35"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d3f"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d0f"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d27"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d31"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d39"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d45"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d1d"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d47"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d4d"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d5b"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d53"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d57"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d55"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d59"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d5d"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d67"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d61"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d63"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d6d"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d65"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d6b"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d5f"
  },
  {
    "_id": "669b7e1a3c7f8e1d2b3c4d69"
  },
  {
    "_id": "68905a39086e9b9bf480da0f"
  },
  {
    "_id": "68905a3a086e9b9bf480da15"
  },
  {
    "_id": "68905a3b086e9b9bf480da1b"
  },
  {
    "_id": "68905a3c086e9b9bf480da21"
  },
  {
    "_id": "68905a3d086e9b9bf480da27"
  },
  {
    "_id": "68905a3e086e9b9bf480da2d"
  },
  {
    "_id": "68905a3e086e9b9bf480da33"
  },
  {
    "_id": "68905a3f086e9b9bf480da39"
  },
  {
    "_id": "68905a40086e9b9bf480da3f"
  },
  {
    "_id": "68905a41086e9b9bf480da45"
  },
  {
    "_id": "68905a42086e9b9bf480da4b"
  },
  {
    "_id": "68905a43086e9b9bf480da51"
  },
  {
    "_id": "68905a44086e9b9bf480da57"
  },
  {
    "_id": "68905a45086e9b9bf480da5d"
  },
  {
    "_id": "68905a46086e9b9bf480da63"
  },
  {
    "_id": "68905a46086e9b9bf480da69"
  },
  {
    "_id": "68905a47086e9b9bf480da6f"
  },
  {
    "_id": "68905a48086e9b9bf480da75"
  },
  {
    "_id": "68905a49086e9b9bf480da7b"
  },
  {
    "_id": "68905a4a086e9b9bf480da81"
  },
  {
    "_id": "68905a4b086e9b9bf480da87"
  },
  {
    "_id": "68905a4c086e9b9bf480da8d"
  },
  {
    "_id": "68905a4d086e9b9bf480da93"
  },
  {
    "_id": "68905a4e086e9b9bf480da99"
  },
  {
    "_id": "68905a4f086e9b9bf480da9f"
  },
  {
    "_id": "68905a50086e9b9bf480daa5"
  },
  {
    "_id": "68905a51086e9b9bf480daab"
  },
  {
    "_id": "68905a51086e9b9bf480dab1"
  },
  {
    "_id": "68905a53086e9b9bf480dab9"
  },
  {
    "_id": "68905a53086e9b9bf480dabf"
  },
  {
    "_id": "68905a54086e9b9bf480dac5"
  },
  {
    "_id": "68905a55086e9b9bf480dacb"
  },
  {
    "_id": "68905a56086e9b9bf480dad1"
  },
  {
    "_id": "68905a57086e9b9bf480dad7"
  },
  {
    "_id": "68905a58086e9b9bf480dadd"
  },
  {
    "_id": "68905a59086e9b9bf480dae3"
  },
  {
    "_id": "68905a5a086e9b9bf480daeb"
  },
  {
    "_id": "68905a5b086e9b9bf480daf1"
  },
  {
    "_id": "68905a5c086e9b9bf480daf7"
  },
  {
    "_id": "68905a5d086e9b9bf480dafd"
  },
  {
    "_id": "68905a5d086e9b9bf480db03"
  },
  {
    "_id": "68905a5e086e9b9bf480db09"
  },
  {
    "_id": "68905a5f086e9b9bf480db0f"
  },
  {
    "_id": "68905a60086e9b9bf480db15"
  },
  {
    "_id": "68905a62086e9b9bf480db1d"
  },
  {
    "_id": "68905a63086e9b9bf480db23"
  },
  {
    "_id": "68905a64086e9b9bf480db29"
  },
  {
    "_id": "68905a64086e9b9bf480db2f"
  },
  {
    "_id": "68905a65086e9b9bf480db35"
  },
  {
    "_id": "68905a66086e9b9bf480db3b"
  },
  {
    "_id": "68905a67086e9b9bf480db41"
  },
  {
    "_id": "68905a68086e9b9bf480db47"
  },
  {
    "_id": "68905a69086e9b9bf480db4f"
  },
  {
    "_id": "68905a6a086e9b9bf480db55"
  },
  {
    "_id": "68905a6b086e9b9bf480db5b"
  },
  {
    "_id": "68905a6c086e9b9bf480db61"
  },
  {
    "_id": "68905a6d086e9b9bf480db67"
  },
  {
    "_id": "68905a6e086e9b9bf480db6d"
  },
  {
    "_id": "68905a6f086e9b9bf480db73"
  },
  {
    "_id": "68905a6f086e9b9bf480db79"
  },
  {
    "_id": "68905a71086e9b9bf480db81"
  },
  {
    "_id": "68905a71086e9b9bf480db87"
  },
  {
    "_id": "68905a72086e9b9bf480db8d"
  },
  {
    "_id": "68905a73086e9b9bf480db93"
  },
  {
    "_id": "68905a74086e9b9bf480db99"
  },
  {
    "_id": "68905a75086e9b9bf480db9f"
  },
  {
    "_id": "68905a76086e9b9bf480dba5"
  },
  {
    "_id": "68905a77086e9b9bf480dbab"
  }
];

// Distribución de usuarios por municipio (lógica de cercanía a Huejutla, total 114 usuarios)
// Basado en la distancia, los municipios más cercanos tienen más usuarios.
const userDistribution = {
    "Huejutla de Reyes": 38, // Central, la mayor cantidad
    "San Felipe Orizatlán": 20, // Muy cerca de Huejutla
    "Atlapexco": 18, // Cerca de Huejutla
    "Jaltocán": 10, // Cerca
    "Tlanchinol": 8, // A una distancia moderada
    "Huautla": 7, // A una distancia moderada
    "Huazalingo": 6, // A una distancia moderada
    "Calnali": 3, // Más lejos
    "Platón Sánchez": 2, // Más lejos
    "Chapulhuacán": 2, // Más lejos
};

// Asignar IDs de usuario a municipios
const usersByMunicipio = {};
for (const municipio in userDistribution) {
    usersByMunicipio[municipio] = [];
}
let userIndex = 0;
for (const municipio in userDistribution) {
    const count = userDistribution[municipio];
    for (let i = 0; i < count; i++) {
        if (userIds[userIndex]) {
            usersByMunicipio[municipio].push(userIds[userIndex]);
            userIndex++;
        }
    }
}

// --- Funciones Auxiliares ---

// Función para obtener un ID de usuario aleatorio, con más probabilidad para Huejutla
function getRandomUserId(preferHuejutla = false) {
    if (preferHuejutla && usersByMunicipio["Huejutla de Reyes"].length > 0 && Math.random() < 0.7) { // 70% de probabilidad de ser de Huejutla
        return usersByMunicipio["Huejutla de Reyes"][Math.floor(Math.random() * usersByMunicipio["Huejutla de Reyes"].length)];
    }
    const allUsers = Object.values(usersByMunicipio).flat();
    return allUsers[Math.floor(Math.random() * allUsers.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para obtener una fecha aleatoria con sesgos de temporada
function getRandomDate(startYear, endYear, monthBias = null) {
    const year = getRandomInt(startYear, endYear);
    let month;

    if (monthBias === 'high_season') { // Primavera/Verano (Abril-Agosto) y Fiestas (Diciembre)
        const highSeasonMonths = [3, 4, 5, 6, 7, 11]; // Abril, Mayo, Junio, Julio, Agosto, Diciembre (0-indexed)
        month = highSeasonMonths[Math.floor(Math.random() * highSeasonMonths.length)];
    } else if (monthBias === 'low_season') { // Xantolo (Octubre-Noviembre) y Post-Vacacional (Enero-Marzo)
        const lowSeasonMonths = [0, 1, 2, 9, 10]; // Enero, Febrero, Marzo, Octubre, Noviembre (0-indexed)
        month = lowSeasonMonths[Math.floor(Math.random() * lowSeasonMonths.length)];
    } else { // Sin sesgo, para una distribución más general
        month = getRandomInt(0, 11); // 0-11 para Enero-Diciembre
    }

    const day = getRandomInt(1, 28); // Para evitar problemas con la longitud de los meses
    const hour = getRandomInt(9, 18);
    const minute = getRandomInt(0, 59);
    const second = getRandomInt(0, 59);
    return new Date(Date.UTC(year, month, day, hour, minute, second));
}

// Función para obtener un comentario de reseña basado en el rating
function getRandomReview(rating) {
    const goodReviews = [
        "¡Excelente vestido! Me encantó el servicio en el local.",
        "El vestido superó mis expectativas, ¡lo recomiendo totalmente!",
        "Quedó perfecto para la ocasión, muy contenta con la compra/renta.",
        "Un diseño hermoso y la atención fue de primera. Volveré sin duda.",
        "Me fascinó cómo me quedó, ¡lo recomiendo a todas mis amigas!",
        "La tela es de muy buena calidad, y el vestido es aún más bonito en persona.",
        "¡Absolutamente precioso! Recibí muchos cumplidos.",
        "Un acierto total, justo lo que buscaba y a un excelente precio."
    ];
    const averageReviews = [
        "El vestido está bien, cumplió con lo esperado.",
        "Bonito vestido, aunque el ajuste no fue 100% perfecto para mí.",
        "Buena opción por el precio, el servicio fue correcto.",
        "Esperaba un poco más, pero en general bien.",
        "Cumple su función, pero no me dejó asombrada.",
        "El vestido es lindo, pero la comunicación podría mejorar.",
        "Me gustó, aunque el color en persona es ligeramente diferente."
    ];
    const lowReviews = [
        "El vestido se veía mejor en las fotos. Necesitaba algunos ajustes.",
        "No fue mi favorito, pero sirvió para la ocasión.",
        "Hubo un pequeño detalle con el vestido, pero fue manejable.",
        "Podría mejorar la limpieza/condición del vestido al entregarlo.",
        "La experiencia fue regular, no estoy segura de volver a rentar.",
        "El vestido no cumplió con mis expectativas de calidad."
    ];

    if (rating >= 4) { // 4 or 5 stars
        return goodReviews[Math.floor(Math.random() * goodReviews.length)];
    } else if (rating === 3) {
        return averageReviews[Math.floor(Math.random() * averageReviews.length)];
    } else { // 1 or 2 stars
        return lowReviews[Math.floor(Math.random() * lowReviews.length)];
    }
}

// --- Función Principal de Inserción ---

async function insertRealisticTransactions() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Conectado a MongoDB");

        const db = client.db("bdAtr");
        const vestidosCollection = db.collection("vestidos"); // Suponemos que tu colección de vestidos se llama "vestidos"
        const transactionsCollection = db.collection("transacciones");

        // 1. Obtener todos los vestidos de la base de datos
        const todosLosVestidos = await vestidosCollection.find({}).toArray();

        if (todosLosVestidos.length === 0) {
            console.error("No se encontraron vestidos en la base de datos. Asegúrate de que la colección 'vestidos' exista y contenga documentos.");
            return;
        }

        const transactions = [];
        const numTransactionsToGenerate = 500;

        // **MODIFICACIÓN CLAVE: Establecer el año de las transacciones a 2023**
        const targetYear = 2023;

        for (let i = 0; i < numTransactionsToGenerate; i++) {
            // Seleccionar un vestido aleatorio de la lista obtenida
            const vestido = todosLosVestidos[Math.floor(Math.random() * todosLosVestidos.length)];

            // Lógica para asignar userId priorizando Huejutla
            const preferHuejutla = Math.random() < 0.6; // 60% de probabilidad de preferir Huejutla
            const userId = getRandomUserId(preferHuejutla);

            const tipoTransaccion = Math.random() < 0.35 ? "renta" : "Venta"; // 35% rentas, 5% ventas
            const total = tipoTransaccion === "Venta" ? (vestido.precio_venta || getRandomInt(800, 5000)) : (vestido.precio_renta || getRandomInt(300, 1500));
            const metodoPago = ["efectivo", "tarjeta_credito", "tarjeta_debito", "transferencia_bancaria"][Math.floor(Math.random() * 4)];
            const estado = "Completada"; // Asumimos que todas se insertan como completadas

            let fechaTransaccion;
            let monthBias = null;

            // Ajustar fecha basada en "temporadas" y preferencia por Huejutla
            // Asumiendo que el usuario es de Huejutla si su ID está en la lista de Huejutla
            const isHuejutlaUser = usersByMunicipio["Huejutla de Reyes"].includes(userId);

            if (isHuejutlaUser) {
                const randomSeasonFactor = Math.random();
                if (randomSeasonFactor < 0.45) { // 45% chance for high season for Huejutla
                    monthBias = 'high_season';
                } else if (randomSeasonFactor < 0.6) { // 15% chance for low season (Xantolo)
                    monthBias = 'low_season';
                } else { // 40% chance for mid season
                    monthBias = null; // Sin sesgo específico para el resto
                }
            } else { // Otros municipios, más equilibrado
                const randomSeasonFactor = Math.random();
                if (randomSeasonFactor < 0.3) { // 30% chance for high season
                    monthBias = 'high_season';
                } else if (randomSeasonFactor < 0.45) { // 15% chance for low season
                    monthBias = 'low_season';
                } else {
                    monthBias = null; // Sin sesgo específico
                }
            }

            // **MODIFICACIÓN APLICADA AQUÍ:** Se pasa 'targetYear' como el rango de años
            fechaTransaccion = getRandomDate(targetYear, targetYear, monthBias);
            const fechaUltimoPago = new Date(fechaTransaccion.getTime() + getRandomInt(5, 60) * 60 * 1000); // 5-60 minutos después

            const transaction = {
                _id: new Mongoose.Types.ObjectId(),
                idUsuario: new Mongoose.Types.ObjectId(userId),
                idVestido: new Mongoose.Types.ObjectId(vestido._id),
                tipoTransaccion: tipoTransaccion,
                fechaTransaccion: fechaTransaccion,
                montoTotal: total,
                detallesPago: {
                    estadoPago: "pagado_total",
                    cantidadPagada: total,
                    metodoPago: metodoPago,
                    fechaUltimoPago: fechaUltimoPago
                },
                estado: estado,
                detallesVestido: {
                    nombre: vestido.nombre,
                    color: vestido.color,
                    talla: vestido.talla,
                    estilo: vestido.estilo,
                    temporada: vestido.temporada
                },
                detallesEntregaLocal: {
                    fechaRecogida: new Date(fechaTransaccion.getTime() + getRandomInt(1, 24) * 60 * 60 * 1000),
                    condicionVestidoAlEntregar: "excelente",
                    notaInternaLocal: "Cliente recogió personalmente. Se verificó el producto."
                }
            };

            if (tipoTransaccion === "renta") {
                const rentalDurationDays = getRandomInt(3, 15);
                const fechaInicioRenta = new Date(transaction.detallesEntregaLocal.fechaRecogida.getTime() + getRandomInt(0, 2) * 24 * 60 * 60 * 1000);
                const fechaFinRenta = new Date(fechaInicioRenta.getTime() + rentalDurationDays * 24 * 60 * 60 * 1000);
                const depositoGarantia = getRandomInt(100, 500);
                const multasAplicadas = Math.random() < 0.15 ? getRandomInt(10, 100) : 0;

                transaction.detallesRenta = {
                    fechaInicioRenta: fechaInicioRenta,
                    fechaFinRenta: fechaFinRenta,
                    depositoGarantia: depositoGarantia,
                    estadoDeposito: multasAplicadas > 0 ? "devuelto_parcial" : "devuelto_total",
                    multasAplicadas: multasAplicadas
                };

                const fechaDevolucion = new Date(fechaFinRenta.getTime() + getRandomInt(0, 3) * 24 * 60 * 60 * 1000);
                const condicionDevolucion = multasAplicadas > 0 ? "daño_menor" : (Math.random() < 0.1 ? "sucio" : "excelente");

                transaction.detallesDevolucionLocal = {
                    fechaDevolucion: fechaDevolucion,
                    condicionVestidoAlDevolver: condicionDevolucion,
                    notaInternaLocal: multasAplicadas > 0 ? `Se aplicó multa de $${multasAplicadas} por ${condicionDevolucion}.` : "Devolución en buen estado."
                };
            }

            // Añadir reseña del cliente
            const rating = Math.random() < 0.7 ? getRandomInt(4, 5) : getRandomInt(1, 3);
            transaction.reseñaCliente = {
                comentario: getRandomReview(rating),
                rating: rating,
                fechaReseña: new Date(transaction.fechaTransaccion.getTime() + getRandomInt(7, 45) * 24 * 60 * 60 * 1000)
            };

            transactions.push(transaction);
        }

        if (transactions.length > 0) {
            console.log(`Intentando insertar ${transactions.length} transacciones...`);
            const result = await transactionsCollection.insertMany(transactions);
            console.log(`${result.insertedCount} transacciones insertadas con éxito.`);
        } else {
            console.log("No se generaron transacciones.");
        }

    } catch (e) {
        console.error("Error al insertar transacciones:", e);
    } finally {
        await client.close();
        console.log("Conexión a MongoDB cerrada.");
    }
}

// Ejecutar la función principal
insertRealisticTransactions();