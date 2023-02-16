const db = require("../db");
const add_hour = (date) => {
  date.setHours(date.getHours() + 1);
  return date;
};

const tracking_factory = (obj) => {
  return new Tracking(
    obj.id,
    obj.userid,
    obj.url,
    obj.size,
    obj.created_on,
    obj.until
  );
};

class Tracking {
  constructor(
    id = undefined,
    userid = undefined,
    url = undefined,
    size = undefined,
    created_on = undefined,
    until = undefined
  ) {
    this.id = id;
    (this.userid = userid), (this.url = url);
    this.size = size;
    this.created_on = created_on;
    this.until = until;
  }

  // for example can fetch by userid
  static async fetchBy(property, id) {
    let trackings = await Tracking.dbGetBy("trackings", property, id);
    let toreturn = [];
    for (let tracking of trackings) {
      //tracking.time = add_hour(tracking.time)
      toreturn.push(tracking_factory(tracking));
    }
    return toreturn;
  }

  //je li tracking pohranjen u bazu podataka?
  async isSavedToDb() {
    if (this.id === undefined) return false;
    let apps = await Tracking.fetchBy("id", this.id);
    return apps.length == 1;
  }

  // dohvat korisnika iz baze podataka na osnovu `what` i `table` odakle uzimamo
  static async dbGetBy(table, what, that) {
    const sql = "SELECT * FROM " + table + " WHERE " + what + " = " + that;
    const result = await db.query(sql, []);
    return result;
  }

  //umetanje zapisa o korisniku u bazu podataka
  async saveToDb() {
    if (this.id !== undefined)
      throw "cannot have defined id and try to save the user";

    const f = this._stringify;

    const sql =
      "INSERT INTO trackings (userid, size, url, created_on, until) VALUES (" +
      [
        f(this.userid),
        f(this.size),
        f(this.url),
        f(this.created_on),
        f(this.until),
      ].join(" , ") +
      ") RETURNING id;";

    const result = await db.query(sql, []);
    this.id = result[0].id;
    return result;
  }

  //umetanje zapisa o korisniku u bazu podataka
  async removeFromDb() {
    if (this.id === undefined)
      throw "cannot have defined id and try to save the user";

    const sql = "DELETE FROM trackings where id = " + this.id;
    const result = await db.query(sql, []);
    this.id = undefined;
    return result;
  }

  _stringify(a) {
    if (a === undefined) return "NULL";
    return "'" + a + "'";
  }

  static _stringify_all(a) {
    if (a === undefined || a === null) return "NULL";
    if (a.toISOString !== undefined)
      a = a.toISOString().slice(0, 19).replace("T", " ");

    if (typeof a === "string")
      if (a.indexOf("-") > -1) return "'" + a + "'" + "::TIMESTAMP ";
      else if (a.indexOf("P0Y0") > -1) {
        a = a.split(" ")[1].replace(/[HM]/g, ":").replace("S", "");
        return "'" + a + "'" + "::INTERVAL ";
      } else return "'" + a + "'";
    return a;
  }

  /*async conflictsWithDb (){
        //ako postoji tracking za isti link kod iste osobe
        //negdi dodat da se provjerava ispravnost linka, jel zara i jel radi
        let beg = "('" + this.time + "'::timestamp)"
        let end = "(" + beg + "+ ('" + this.duration + "'::interval))"
        let constraint_list = []
        
        if (this.doctorid !== undefined)
            constraint_list.push("doctorid = " + this.doctorid)
        if (this.nurseid !== undefined)
            constraint_list.push("nurseid = " + this.nurseid)
        if (this.patientid !== undefined)
            constraint_list.push("patientid = " + this.patientid)

        let constraint_str = constraint_list.join(' or ')

        const sql = `
            SELECT * from appointment a
            where not (( a.time <= ` + beg + ` and a.time + a.duration <= `+beg+`) or
                       (`+beg+`<= a.time and `+ end + `<=a.time))
                    and (` + constraint_str +`) 
        `
        const result = await db.query(sql, []);

        if (this.id === undefined)
            return result.length > 0
        return result.length > 1
    }*/

  async updateDb() {
    let f = Tracking._stringify_all;
    console.log("updating...");
    console.log(this.time);
    const sql =
      `UPDATE trackings 
                    SET userid=` +
      f(this.userid) +
      `, size=` +
      f(this.size) +
      `, url=` +
      f(this.url) +
      ", created_on=" +
      f(this.created_on) +
      ", until=" +
      f(this.until) +
      ` WHERE id=` +
      f(this.id);
    return await db.query(sql, []);
  }
}

module.exports = Tracking;
