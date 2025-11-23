const mongoose = require("mongoose");

/* ---------- POST ---------- */
const PostSchema = new mongoose.Schema({
  usuariaId:  { type: mongoose.Schema.Types.ObjectId, ref: "Usuarios", required: true },
  imagenUrls:  { type: [String], required: true, default: [] }, // ← CAMBIO: Array de URLs
  descripcion:{ type: String, maxlength: 500 },
  etiqueta:   { type: String, enum: ["comprado", "rentado", "propio"], default: "propio" },
  aprobado:   { type: Boolean, default: false },
  fecha:      { type: Date, default: Date.now }
});

/* ---------- LIKE ---------- */
const LikeSchema = new mongoose.Schema({
  postId:    { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  usuariaId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuarios", required: true },
  fecha:     { type: Date, default: Date.now }
});
LikeSchema.index({ postId: 1, usuariaId: 1 }, { unique: true });

/* ---------- COMENTARIO ---------- */
const ComentarioSchema = new mongoose.Schema({
  postId:    { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  usuariaId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuarios", required: true },
  texto:     { type: String, maxlength: 300, required: true },
  fecha:     { type: Date, default: Date.now }
});

/* ---------- GUARDADO ---------- */
const GuardadoSchema = new mongoose.Schema({
  usuariaId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuarios", required: true },
  postId:    { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  fecha:     { type: Date, default: Date.now }
});
GuardadoSchema.index({ usuariaId: 1, postId: 1 }, { unique: true });

/* ---------- EXPORT ---------- */
module.exports = {
  Post:       mongoose.model("Post", PostSchema),
  Like:       mongoose.model("Like", LikeSchema),
  Comentario: mongoose.model("Comentario", ComentarioSchema),
  Guardado:   mongoose.model("Guardado", GuardadoSchema)
};