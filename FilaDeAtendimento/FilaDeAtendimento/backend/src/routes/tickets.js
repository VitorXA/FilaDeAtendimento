import { Router } from 'express';
import { pool } from '../config/db.js';
import { syncQueue } from '../services/queue.js';
const router=Router();
router.get('/:id',async(req,res)=>{try{const {rows}=await pool.query('SELECT t.*,q.name queue_name,q.code FROM tickets t JOIN queues q ON q.id=t.queue_id WHERE t.id=$1',[req.params.id]);if(!rows[0])return res.status(404).json({error:'Senha não encontrada'});res.json({ticket:rows[0]});}catch(e){res.status(500).json({error:'Erro ao consultar senha'})}});
router.get('/queue/:id/history',async(req,res)=>{try{const {rows}=await pool.query("SELECT id,client_name,number,status,created_at,called_at,finished_at FROM tickets WHERE queue_id=$1 ORDER BY id DESC LIMIT 100",[req.params.id]);res.json({tickets:rows});}catch(e){res.status(500).json({error:'Erro ao consultar histórico'})}});
export default router;
