import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
const router=Router();
const token=u=>jwt.sign({id:u.id,username:u.username,role:u.role},process.env.JWT_SECRET,{expiresIn:'8h'});
router.post('/register',async(req,res)=>{try{const {username,password,cpf}=req.body;if(!username||!password||!cpf)return res.status(400).json({error:'Preencha todos os campos'});if(password.length<6)return res.status(400).json({error:'A senha deve ter pelo menos 6 caracteres'});const exists=await pool.query('SELECT id FROM users WHERE username=$1 OR cpf=$2',[username.trim(),cpf.trim()]);if(exists.rowCount)return res.status(409).json({error:'Usuário ou CPF já cadastrado'});const hash=await bcrypt.hash(password,12);const {rows}=await pool.query('INSERT INTO users(username,password_hash,cpf) VALUES($1,$2,$3) RETURNING id,username,cpf,role',[username.trim(),hash,cpf.trim()]);res.status(201).json({user:rows[0],token:token(rows[0])});}catch(e){console.error(e);res.status(500).json({error:'Erro ao cadastrar'})}});
router.post('/login',async(req,res)=>{try{const {username,password}=req.body;const {rows}=await pool.query('SELECT * FROM users WHERE username=$1',[username?.trim()]);const u=rows[0];if(!u||!(await bcrypt.compare(password||'',u.password_hash)))return res.status(401).json({error:'Usuário ou senha inválidos'});res.json({user:{id:u.id,username:u.username,cpf:u.cpf,role:u.role},token:token(u)});}catch(e){console.error(e);res.status(500).json({error:'Erro ao entrar'})}});
export default router;
