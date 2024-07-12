import db from "../config/database.js";
import { ContainerModel } from "../models/Container.js";

class ContainerController {
    static listContainers = async (req, res) => {
        try {
            const rows = new ContainerModel();
            rows.getContainers().then(data => {
                res.json({
                    "message": "success",
                    "data": data
                })
            });
        } catch (err) {
            res.status(500).json({ message: "Erro interno no servidor!"});
        }
    }

    static createContainer = async (req, res) => {
        try {
            const { name } = req.body;

            const newContainer = await ContainerModel.createContainer(name);

            res.json({
                message: "Container criado com sucesso",
                data: newContainer
            });
        } catch (err) {
            res.status(500).json({ message: "Erro interno no servidor", error: err.message });
        }
    }
}

export default ContainerController;
