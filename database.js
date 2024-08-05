import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user:  process.env.MYSQL_USER,
    password :  process.env.MYSQL_PASSWORD,
    database :  process.env.MYSQL_DATABASE
}).promise()


export async function getAllData() {
    const [rows] = await pool.query("SELECT * FROM rules")
    return rows
}

export async function getData(id) {
    const [rows] = await pool.query("SELECT * FROM rules WHERE id = ? ", [id])
    return rows
}

export async function createData(string) {
    const [result] = await pool.query('INSERT INTO rules (contents) VALUES (?)', [string])
    return getData(result.insertId)
}


export async function updateData(id, string) {
    const [result] = await pool.query('INSERT INTO rules (contents) VALUES (?, ?)', [id ,string])
    return result
}

export async function deleteData(id) {
    const [result] = await pool.query('DELETE FROM rules WHERE id = ?', [id] )
    return result
}

export async function deleteAllData() {
    const [result] = await pool.query('DELETE FROM rules')

    //reset id counter
    await pool.query('ALTER TABLE rules AUTO_INCREMENT = 1')
    return result
}
