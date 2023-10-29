import passport from 'passport';
import local from 'passport-local';
import { createHash, isValidPassword } from '../utils.js';
import UserManager from '../DAO/manager/UserManager.js';
import GitHubStrategy from 'passport-github2';

const LocalStrategy = local.Strategy;
const userMan = new UserManager();

const initializePassword = () => {
  passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
      const { first_name, last_name, email, age, rol } = req.body;
      console.log('Registrando usuario...');

      try {
        let user = await userMan.findEmail({ email: username });
        if (user) {
          console.log('El usuario ya existe');
          return done(null, false);
        }

        const hashedPassword = await createHash(password);

        const newUser = {
          first_name,
          last_name,
          email,
          age,
          password: hashedPassword,
          rol,
        };

        let result = await userMan.addUser(newUser);
        console.log('Usuario registrado con éxito.');
        return done(null, result);
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
        return done('Error al obtener el usuario' + error);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userMan.getUserById(id);
    done(null, user);
  });

  passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
    console.log('Iniciando sesión...');
    try {
      const user = await userMan.findEmail({ email: username });
      if (!user) {
        console.log('Usuario no existe');
        return done(null, false);
      }
      if (!isValidPassword(user, password)) {
        console.log('Contraseña incorrecta');
        return done(null, false);
      }
      console.log('Inicio de sesión exitoso.');
      return done(null, user);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return done(error);
    }
  }));

  passport.use('github', new GitHubStrategy({
    clientID: '79677e1d34c5930b950c',
    clientSecret: '34cde69c959338ea19078cc4ba31ae9a84263e2a',
    callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('Iniciando sesión con GitHub...');
    try {
      let user = await userMan.findEmail({ email: profile._json.email });
      if (!user) {
        let newUser = {
          first_name: profile._json.login,
          last_name: 'github',
          age: 77,
          email: profile._json.email,
          password: '',
          rol: 'usuario',
        };
        let result = await userMan.addUser(newUser);
        console.log('Usuario de GitHub registrado con éxito.');
        done(null, result);
      } else {
        console.log('Inicio de sesión con GitHub exitoso.');
        done(null, user);
      }
    } catch (error) {
      console.error('Error al iniciar sesión con GitHub:', error);
      return done(error);
    }
  }));
};

export default initializePassword;