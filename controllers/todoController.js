const Todo = require('../models/todo');
const { notifyClientsAboutTodoUpdate } = require('../index'); // Importar notifyClientsAboutTodoUpdate 


// Obtener todas las tareas
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
};

// Crear una nueva tarea
exports.createTodo = async (req, res) => {
  try {
    const { title, completed, description } = req.body;
    const newTodo = await Todo.create({ title , completed, description });
    res.status(201).json(newTodo);
    
    // Notificar a los clientes WebSocket
    notifyClientsAboutTodoUpdate();
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
};

// Actualizar tarea
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const todo = await Todo.findByPk(id);
    
    // Verifica si la tarea existe
    if (!todo) {
      return res.status(404).json({ error: 'Tarea no encontrada' }); // Asegúrate de usar 'return' para evitar continuar después de enviar la respuesta
    }

    // Actualiza la tarea
    todo.title = title;
    todo.completed = completed;
    todo.description = description;
    await todo.save();

    // Envía la respuesta actualizada
    return res.status(200).json(todo); // Usa 'return' para asegurar que no haya más respuestas
  } catch (error) {
    // En caso de error, envía una respuesta de error
    return res.status(500).json({ error: 'Error al actualizar la tarea' }); // También 'return' aquí
  }
};

// Eliminar tarea
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id);
    if (!todo) return res.status(404).json({ error: 'Tarea no encontrada' });
    await todo.destroy();
    res.status(204).send();
    
    // Notificar a los clientes WebSocket
    notifyClientsAboutTodoUpdate();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};
