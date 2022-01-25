var express = require('express');
var router = express.Router();

const MemberModifyMethod = require('../controllers/member/modify_controller');

memberModifyMethod = new MemberModifyMethod();

router.post('/register', memberModifyMethod.postRegister);
router.post('/login', memberModifyMethod.postLogin);
router.put('/update', memberModifyMethod.putUpdate);
router.put('/updateimg', memberModifyMethod.putUpdateImg);

module.exports = router;
