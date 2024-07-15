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

    static deleteContainer = async (req, res) => {
        try {
            const { id } = req.params;

            await ContainerModel.deleteContainer(id);

            res.json({
                message: "Container deletado com sucesso",
                data: { id }
            });
        } catch (err) {
            res.status(500).json({ message: "Erro interno no servidor", error: err.message });
        }
    }
    
    static updateContainerName = async (req, res) => {
        try {
            const { id, name } = req.body;
            if (!id) {
                return res.status(400).json({ message: "O ID do container é obrigatório!" });
            }

            const updatedContainer = await ContainerModel.updateContainerName(id, name);

            res.json({
                message: "Container atualizado com sucesso",
                data: updatedContainer
            });
        } catch (err) {
            if (err.message === "Container não encontrado!") {
                return res.status(404).json({ message: "Container não encontrado!" });
            }
            res.status(500).json({ message: "Erro interno no servidor", error: err.message });
        }
    }
}

export default ContainerController;
