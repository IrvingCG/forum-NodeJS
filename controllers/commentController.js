const Comment = require('../models/Comment');
const Topic = require('../models/Topic');

exports.createComment = async (req, res) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        const topic = await Topic.findById(req.body.topicId);
        topic.comments.push(comment._id);
        await topic.save();
        res.status(201).send(comment);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getComment= async (req, res) => {
    try {
        // Aquí va la lógica para obtener el tema por su ID
    } catch (error) {
        // Aquí maneja los errores
    }
};
