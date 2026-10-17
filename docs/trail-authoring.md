# Trail authoring

Story trails are the walk games served by `/play`, `/next`, `/awty`, `/journal`, and `/items`. Task `content` is markdown. This note covers the bits of copy that change per play.

## Date tokens

Write a token instead of a fixed date. It is resolved when the response is sent, from the Europe/London calendar date of the session's `playStart` (the day that play started). Continuing the next day keeps the same play day, so a logbook does not drift mid-story. Start Again begins a new play day.

The only anchor is `P`, the play day.

```
{{P}}                  play day, default format (Thu 17 Sep)
{{P-1}}                one calendar day before
{{P+3}}                three calendar days after
{{P-9|dddd d MMM}}     an explicit format
{{P-2|rel}}            yesterday / a weekday / last Thursday / …
{{P|Rel}}              same as rel, with a capital first letter
```

Offsets are whole calendar days, including across the March and October clock changes.

Format codes (en-GB):

| Code | Example |
| --- | --- |
| `dddd` | Thursday |
| `ddd` | Thu |
| `d` | 17 |
| `dd` | 17 (zero-padded, so the 5th is `05`) |
| `Do` | 17th |
| `MMMM` | September |
| `MMM` | Sep |
| `MM` | 09 |
| `yyyy` | 2026 |
| `yy` | 26 |

Anything else in the format is kept as written, so `{{P|d MMM yyyy}}` is `17 Sep 2026`. With no format, the token uses `ddd d MMM`.

`rel` (and `Rel`) depends on the offset `n`:

- `0` today, `-1` yesterday, `+1` tomorrow
- `-2` to `-6`, and `+2` to `+6`: the weekday on its own (`Thursday`)
- `-7` to `-13`: `last Thursday`
- `+7` to `+13`: `next Thursday`
- 14 days or more either way: the default `ddd d MMM`

`Rel` capitalises the first letter (`Yesterday`, `Last Thursday`) for the start of a sentence.

Tokens are resolved in player-visible copy: task content, hints, titles, captions, option content and labels, and item name, title, and subtitle. Image and audio URLs are not touched.

An unknown token such as `{{Q}}`, or a format that contains a letter that is not a code (`{{P|notAFormat}}`), is left as written so the author can see it. It does not fail the request.

```markdown
The burglary was reported {{P-2|rel}} ({{P-2|dddd d MMM}}).

| Date | Drop |
| --- | --- |
| {{P-9|ddd d MMM}} | Parcel left at the side door |
| {{P-1|ddd d MMM}} | Van returned after midnight |
| {{P|ddd d MMM}} | You open the logbook |
```

## Items tab: `items_enabled`

Top-level boolean on the trail JSON. It controls whether the player's game page shows the **Items** tab.

```json
{ "ref": "my-trail", "items_enabled": true, ... }
```

- Only `true` shows the tab. Absent, `false`, or anything else hides it. **Any trail that grants items (`items[]` catalogue with `addItem`, `items_added`, item-gated logic) must set `items_enabled: true`, or its players won't see their items.**
- The Journal and the exit (Leave game) tab are unaffected. Items can still be granted server-side whatever the flag says; the flag only controls what is shown.
- It is exposed to the client as `items_enabled` (always a boolean) on each game in `/list`, on `/play` responses, and on batch `/next` responses (alongside `position` / `upcoming`) including `sync_position`. A client that has never received the flag for a trail hides the tab.
