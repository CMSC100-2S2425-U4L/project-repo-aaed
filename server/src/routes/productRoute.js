import {
    saveProduct,
    removeProduct,
    updateProduct
} from '../controllers/productController.js';

const router = (app) => {
    app.post('/', saveProduct);
    app.delete('/:id', removeProduct);
    app.put('/:id', updateProduct);

}

export default router;