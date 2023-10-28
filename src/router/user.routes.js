import express from "express";
import UserManager from "../controllers/UserManager.js";
import { Router } from "express";
import { createHash, isValidPassword } from '../utils.js';
import passport from "passport";

// Crear una instancia de Express y un enrutador
const app = express();
const userRouter = Router();
const user = new UserManager();

// Middleware para procesar datos JSON y URL codificados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registro de usuarios
userRouter.post("/register", passport.authenticate("register", { failureRedirect: "/failregister" }), async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, rol } = req.body;

    // Verificar que se proporcionen todos los datos requeridos
    if (!first_name || !last_name || !email || !age) {
      return res.status(400).send({ status: 400, error: 'Faltan datos' });
    }

    // Realizar la lógica de registro aquí
    user.addUser(req.body);

    // Redirigir al usuario a la página de inicio de sesión
    res.redirect("/login");
  } catch (error) {
    res.status(500).send("Error al acceder al registrar: " + error.message);
  }
});

// Ruta de manejo de errores en el registro
userRouter.get("/failregister", async (req, res) => {
  console.log("Failed Strategy");
  res.send({ error: "Failed" });
});

// Inicio de sesión de usuarios
userRouter.post("/login", passport.authenticate("login", { failureRedirect: "/faillogin" }), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).send({ status: "error", error: "Credenciales inválidas" });
    }

    // Realiza la lógica de inicio de sesión aquí

  } catch (error) {
    res.status(500).send("Error al acceder al perfil: " + error.message);
  }
});

// Ruta de manejo de errores en el inicio de sesión
userRouter.get("/faillogin", async (req, res) => {
  res.send({ error: "Failed Login" });
});

// Cierre de sesión
userRouter.get("/logout", async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.json({ status: 'Logout Error', body: error });
    }
    res.redirect('../../login');
  });
});

// Autenticación con GitHub
userRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => {});

// Devolución de llamada después de la autenticación de GitHub
userRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
  req.session.user = req.user;
  req.session.emailUsuario = req.session.user.email;
  req.session.rolUsuario = req.session.user.rol;
  res.redirect("/products");
});

// Exportar el enrutador
export default userRouter;