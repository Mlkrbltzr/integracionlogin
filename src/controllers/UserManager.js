import { promises as fs } from 'fs';
import { nanoid } from "nanoid";
import { usersModel } from '../models/users.model.js';

class UserManager extends usersModel {
    constructor() {
        super();
    }

    // Crea un usuario y lo agrega a la base de datos.
    async addUser(userData) {
        try {
            const userCreate = await usersModel.create(userData);
            return {
                message: 'Usuario agregado',
                user: userCreate,
            };
        } catch (error) {
            console.error('Error al agregar el usuario:', error);
            return 'Error al agregar el usuario';
        }
    }

    // Actualiza un usuario existente por su ID.
    async updateUser(id, userData) {
        try {
            const user = await usersModel.findById(id);
            if (!user) {
                return 'Usuario no encontrado';
            }
            user.set(userData);
            await user.save();
            return 'Usuario actualizado';
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            return 'Error al actualizar el usuario';
        }
    }

    // Obtiene todos los usuarios de la base de datos.
    async getUsers() {
        try {
            const users = await usersModel.find({});
            return users;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            return [];
        }
    }

    // Obtiene un usuario por su ID.
    async getUserById(id) {
        try {
            const user = await usersModel.findById(id).lean();
            if (!user) {
                return 'Usuario no encontrado';
            }
            return user;
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            return 'Error al obtener el usuario';
        }
    }

    // Elimina un usuario por su ID.
    async deleteUser(id) {
        try {
            const user = await usersModel.findById(id);
            if (!user) {
                return 'Usuario no encontrado';
            }
            await user.remove();
            return 'Usuario eliminado';
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            return 'Error al eliminar el usuario';
        }
    }

    // Valida un usuario por su dirección de correo electrónico.
    async validateUser(param) {
        try {
            const user = await usersModel.findOne({ email: param });
            if (!user) {
                return "Usuario no encontrado";
            }
            return user;
        } catch (error) {
            console.error('Error al validar usuario', error);
            return 'Error al obtener el usuario';
        }
    }
}

export default UserManager;
