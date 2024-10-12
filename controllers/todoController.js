const Todo = require('../models/todo');

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
    if (!todo) return res.status(404).json({ error: 'Tarea no encontrada' });
    todo.title = title;
    todo.completed = completed;
    todo.description = description;
    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
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
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
};
