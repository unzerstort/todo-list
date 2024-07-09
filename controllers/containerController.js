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
}

export default ContainerController;
