#!/usr/bin/env node
// Spaja fragmente prevoda iz /tmp/i18nfrag/*.json u messages/{sr,en,hu}.json.
// Fragment format: { "<namespace>": { "<key>": {"sr":"..","en":"..","hu":".."} } }
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const FRAG = "/tmp/i18nfrag";
const msg = { sr:JSON.parse(readFileSync("messages/sr.json","utf8")),
              en:JSON.parse(readFileSync("messages/en.json","utf8")),
              hu:JSON.parse(readFileSync("messages/hu.json","utf8")) };
let added=0;
for (const f of readdirSync(FRAG).filter(x=>x.endsWith(".json"))) {
  const frag = JSON.parse(readFileSync(join(FRAG,f),"utf8"));
  for (const ns in frag) {
    for (const loc of ["sr","en","hu"]) msg[loc][ns] = msg[loc][ns] || {};
    for (const key in frag[ns]) {
      const v = frag[ns][key];
      msg.sr[ns][key] = v.sr; msg.en[ns][key] = v.en ?? v.sr; msg.hu[ns][key] = v.hu ?? v.en ?? v.sr;
      added++;
    }
  }
  console.log("spojen",f);
}
for (const loc of ["sr","en","hu"]) writeFileSync(`messages/${loc}.json`, JSON.stringify(msg[loc],null,2)+"\n");
console.log(`\nUkupno ključeva spojeno: ${added}`);
