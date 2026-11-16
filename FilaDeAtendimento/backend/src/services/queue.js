import { pool } from "../config/db.js";
import { redis } from "../config/redis.js";

const key = (id) => `queue:${id}:waiting`;

export async function syncQueue(id) {
  const { rows } = await pool.query(
    "SELECT number FROM tickets WHERE queue_id=$1 AND status='WAITING' ORDER BY number",
    [id],
  );

  const queueKey = key(id);
  const multi = redis.multi().del(queueKey);

  if (rows.length) {
    multi.rPush(queueKey, ...rows.map((row) => String(row.number)));
  }

  await multi.exec();
}

export async function queueState(id) {
  const queue = (
    await pool.query(
      "SELECT id,name,code,next_number FROM queues WHERE id=$1",
      [id],
    )
  ).rows[0];

  if (!queue) return null;

  const current =
    (
      await pool.query(
        `
      SELECT id,client_name,number,status,queue_id,called_at
      FROM tickets
      WHERE queue_id=$1
        AND status IN ('CALLED','SERVING')
      ORDER BY called_at DESC NULLS LAST
      LIMIT 1
      `,
        [id],
      )
    ).rows[0] || null;

  const waitingRows = (
    await pool.query(
      `
      SELECT number
      FROM tickets
      WHERE queue_id=$1
        AND status='WAITING'
      ORDER BY number
      `,
      [id],
    )
  ).rows;

  const waiting = waitingRows.map((row) => Number(row.number));

  const queueKey = key(id);
  const multi = redis.multi().del(queueKey);

  if (waiting.length) {
    multi.rPush(queueKey, ...waiting.map(String));
  }

  await multi.exec();

  return {
    queue,
    current,
    waiting,
    waitingCount: waiting.length,
  };
}
