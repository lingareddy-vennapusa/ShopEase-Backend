const express = require("express")
const {addProduct,getProducts,getProductById,updateProduct,deleteProduct}=require("../controllers/productController")
const isAdmin= require("../middleware/roleMiddleware")
const protect =require("../middleware/authMiddleware")


const router = express.Router();


router.post("/", protect, isAdmin, addProduct);


router.get("/", getProducts);
router.get("/:id", getProductById);


router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

module.exports = router;

