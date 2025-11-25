// Import necessary modules
const fetch = require('node-fetch');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { parseISO, format, getYear } = require('date-fns');

// --- CONFIGURATION ---
const API_URL = "http://localhost:4000/api/v1/transaccion?limit=5000";
const EXCLUDED_USER_EMAIL = "20221136@uthh.edu.mx";
const OUTPUT_FILE_COMBINED = 'atelier-dataset-2023-2025-transacciones-unificado.csv';

const TARGET_YEARS = [2023, 2024, 2025]; 

async function generateCombinedTransactionDataset() {
    try {
        console.log(`Fetching data from: ${API_URL}`);
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (!data || !Array.isArray(data.data)) {
            throw new Error("API response does not contain a 'data' array");
        }

        console.log(`Total records obtained from API: ${data.data.length}`);

        const transactionsByYear = {};
        TARGET_YEARS.forEach(year => {
            transactionsByYear[year] = [];
        });

        data.data.forEach(t => {
            if (t.idUsuario?.email === EXCLUDED_USER_EMAIL) {
                return;
            }

            const transactionDate = t.fechaTransaccion ? parseISO(t.fechaTransaccion) : null;
            
            if (transactionDate) {
                const year = getYear(transactionDate);
                if (TARGET_YEARS.includes(year)) {
                    transactionsByYear[year].push(t);
                }
            }
        });

        TARGET_YEARS.forEach(year => {
            const count = transactionsByYear[year].length;
            console.log(`Transactions for ${year}: ${count}`);
        });

        const totalFilteredTransactions = Object.values(transactionsByYear).flat().length;
        console.log(`Total filtered transactions for target years: ${totalFilteredTransactions}`);


        // 4. Process the data for CSV
        const tickets = Object.values(transactionsByYear)
            .flat()
            .map(t => {
                let fineApplied = 0;
                const returnNote = t.detallesDevolucionLocal?.notaInternaLocal || '';
                if (returnNote.includes('multa')) {
                    const parts = returnNote.split('$');
                    if (parts.length > 1) {
                        const amountString = parts[parts.length - 1].split(' ')[0];
                        fineApplied = parseFloat(amountString) || 0;
                    }
                }

                const transactionDate = t.fechaTransaccion ? parseISO(t.fechaTransaccion) : null;
                const deliveryDate = t.detallesEntregaLocal?.fechaRecogida ? parseISO(t.detallesEntregaLocal.fechaRecogida) : null;
                const returnDate = t.detallesDevolucionLocal?.fechaDevolucion ? parseISO(t.detallesDevolucionLocal.fechaDevolucion) : null;
                const reviewDate = t.reseñaCliente?.fechaReseña ? parseISO(t.reseñaCliente.fechaReseña) : null;

                return {
                    // Transaction Info
                    transaccion_id: t._id,
                    fecha_transaccion: transactionDate ? format(transactionDate, 'yyyy-MM-dd HH:mm:ss') : null,
                    tipo_transaccion: t.tipoTransaccion,
                    estado: t.estado,
                    monto_total: t.montoTotal,
                    metodo_pago: t.detallesPago?.metodoPago,

                    // Client Info
                    cliente_nombre: t.idUsuario?.email,
                    cliente_telefono: t.idUsuario?.telefono,
                    cliente_localidad: t.idUsuario?.localidad || null,

                    // Product Info
                    producto_id: t.idVestido?._id,  // <-- NUEVO: Agregamos el ID del producto
                    producto_nombre: t.idVestido?.nombre,
                    producto_talla: t.idVestido?.talla,
                    producto_color: t.idVestido?.color,
                    producto_temporada: t.idVestido?.temporada ? t.idVestido.temporada.join(', ') : null,
                    cantidad_comprada: t.cantidad || 1,
                    
                    // Additional Dress Info
                    vestido_estilo: t.idVestido?.estilo || null,
                    vestido_precio_venta: t.idVestido?.precio_venta || null,
                    vestido_precio_renta: t.idVestido?.precio_renta || null,
                    vestido_en_oferta: t.idVestido?.en_oferta || false,
                    vestido_condicion: t.idVestido?.condicion || null,
                    vestido_rating_promedio: t.idVestido?.rating_promedio || null,
                    vestido_review_count: t.idVestido?.review_count || null,

                    // Delivery/Return Info
                    fecha_entrega: deliveryDate ? format(deliveryDate, 'yyyy-MM-dd HH:mm:ss') : null,
                    fecha_devolucion: returnDate ? format(returnDate, 'yyyy-MM-dd HH:mm:ss') : null,
                    multa_aplicada: fineApplied,

                    // Review Info
                    reseña_rating: t.reseñaCliente?.rating || null,
                    reseña_comentario: t.reseñaCliente?.comentario || null,
                    fecha_reseña: reviewDate ? format(reviewDate, 'yyyy-MM-dd HH:mm:ss') : null,
                };
            });

        // 5. Configure and write the CSV file
        const csvWriter = createCsvWriter({
            path: OUTPUT_FILE_COMBINED,
            header: [
                { id: 'transaccion_id', title: 'transaccion_id' },
                { id: 'fecha_transaccion', title: 'fecha_transaccion' },
                { id: 'tipo_transaccion', title: 'tipo_transaccion' },
                { id: 'estado', title: 'estado' },
                { id: 'monto_total', title: 'monto_total' },
                { id: 'metodo_pago', title: 'metodo_pago' },
                { id: 'cliente_nombre', title: 'cliente_nombre' },
                { id: 'cliente_telefono', title: 'cliente_telefono' },
                { id: 'cliente_localidad', title: 'cliente_localidad' },
                { id: 'producto_id', title: 'producto_id' },  // <-- NUEVO: Agregamos el encabezado para el ID
                { id: 'producto_nombre', title: 'producto_nombre' },
                { id: 'producto_talla', title: 'producto_talla' },
                { id: 'producto_color', title: 'producto_color' },
                { id: 'producto_temporada', title: 'producto_temporada' },
                { id: 'cantidad_comprada', title: 'cantidad_comprada' },
                { id: 'vestido_estilo', title: 'vestido_estilo' },
                { id: 'vestido_precio_venta', title: 'vestido_precio_venta' },
                { id: 'vestido_precio_renta', title: 'vestido_precio_renta' },
                { id: 'vestido_en_oferta', title: 'vestido_en_oferta' },
                { id: 'vestido_condicion', title: 'vestido_condicion' },
                { id: 'vestido_rating_promedio', title: 'vestido_rating_promedio' },
                { id: 'vestido_review_count', title: 'vestido_review_count' },
                { id: 'fecha_entrega', title: 'fecha_entrega' },
                { id: 'fecha_devolucion', title: 'fecha_devolucion' },
                { id: 'multa_aplicada', title: 'multa_aplicada' },
                { id: 'reseña_rating', title: 'reseña_rating' },
                { id: 'reseña_comentario', title: 'reseña_comentario' },
                { id: 'fecha_reseña', title: 'fecha_reseña' },
            ]
        });

        await csvWriter.writeRecords(tickets);
        
        // 6. Final report
        console.log(`\nDataset successfully generated: ${OUTPUT_FILE_COMBINED}`);
        console.log(`Total transactions processed (for years ${TARGET_YEARS.join(', ')}): ${tickets.length}`);
        TARGET_YEARS.forEach(year => {
            console.log(`- ${year}: ${transactionsByYear[year].length} transactions`);
        });

    } catch (error) {
        console.error("\nError generating dataset:", error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error("Please ensure the server is running at http://localhost:4000");
        }
        process.exit(1); // Exit with error code
    }
}

// Execute the function
generateCombinedTransactionDataset();