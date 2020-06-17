const User = require('../models/User');
const Tech = require('../models/Tech');

module.exports = {
    async index(req, res) {
        const { user_id } = req.params;

        const user = await User.findByPk(user_id, {
            include: {
                association: 'techs',
                attributes: ['name'],
                through: {
                    attributes: ['user_id', 'tech_id']
                }
            }
        });

        return res.json(user);
    },

    async store(req, res) {
        const { user_id } = req.params;
        const { name } = req.body;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const [tech, created] = await Tech.findOrCreate({
            where: { name }
        });

        await user.addTech(tech);

        return res.json(tech);
    },

    async delete(req, res) {
        const { user_id } = req.params;
        const { name } = req.body;

        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const tech = await Tech.findOn({
            where: { name }
        });

        await user.removeTech(tech);

        return res.json();
    }
};