# Batch next

`POST /next` and `POST /awty` accept `batch: true`. Trail-engine responses then add:

- `position` — session position of `task` (step*100 + index; task ids are not reliable positions).
- `upcoming[]` — cleaned cards after `task` in the same step, up to and including the next
  blocking card (any non-`information` type) or the end of the step. Empty if `task` is blocking.
  Each entry = card + `position`, `server_call_required` (source had `on_arrival`), `items`
  (items granted by its `on_arrival`).

`task`, `outcome`, `ok` are unchanged. Empty answer → `ok:false`; unmatched answer → no task/upcoming;
matched negative option → same question back, `upcoming: []`.

**Session advance:** every batched card's `on_arrival` is applied when the batch is sent, and
`session.task` moves to the last card in the batch. The state each card was cleaned with is kept in
`session.input.__batch` (no schema change).

**Cross-check:** `POST /next { batch: true, sync_position: N }` is read-only. It returns
`{ ok, synced, position, task }` for a card in the current batch, re-cleaned with its stored state,
or `{ ok:false, synced:false, reason, position: session.task }`.

**Local test:** `BATCH_TRAIL_FILE=trail.json npx tsx scripts/local-batch-server.ts` serves
/next, /play and /awty on :3001, using file sessions.
