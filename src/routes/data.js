const app = require('../app');
const router = require('express').Router();

const diContainer = app.get('DI');
const dataController = diContainer.get('data-controller');

router.post('/insert', dataController.insertData);
router.get('/retrieve', dataController.retrieveData);

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

module.exports = router;
