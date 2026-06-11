const express = require('express');

const router = express.Router();

const db = require('../db');

const verifyToken =
require('../middleware/authMiddleware');

router.post(
'/add',
verifyToken,
(req,res)=>{

    const {
        title,
        description
    } = req.body;

    db.query(
        'INSERT INTO tasks(title,description,user_id) VALUES(?,?,?)',
        [
            title,
            description,
            req.user.id
        ],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:'Task Added'
            });

        }
    );

});

router.get(
'/all',
verifyToken,
(req,res)=>{

    db.query(
        'SELECT * FROM tasks WHERE user_id=?',
        [req.user.id],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});

router.put(
'/update/:id',
verifyToken,
(req,res)=>{

    const { title } = req.body;

    db.query(
        'UPDATE tasks SET title=? WHERE id=?',
        [
            title,
            req.params.id
        ],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:'Task Updated'
            });

        }
    );

});


router.delete(
'/delete/:id',
verifyToken,
(req,res)=>{

    db.query(
        'DELETE FROM tasks WHERE id=?',
        [req.params.id],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:'Task Deleted'
            });

        }
    );

});
router.put(
'/complete/:id',
verifyToken,
(req,res)=>{

    db.query(
        'UPDATE tasks SET status="Completed" WHERE id=?',
        [req.params.id],
        (err,result)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:'Task Completed'
            });

        }
    );

});
module.exports = router;