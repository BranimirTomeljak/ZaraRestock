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
    obj.until,
    obj.success
  );
};

class Tracking {
  constructor(
    id = undefined,
    userid = undefined,
    url = undefined,
    size = undefined,
    created_on = undefined,
    until = undefined,
    success = undefined
  ) {
    this.id = id;
    (this.userid = userid), (this.url = url);
    this.size = size;
    this.created_on = created_on;
    this.until = until;
    this.success = success;
  }

  // for example can fetch by userid
  static async fetchBy(property, id) {
    let trackings = await Tracking.dbGetBy("trackings", property, id);
    let toreturn = [];
    for (let tracking of trackings) {
      tracking.created_on = add_hour(tracking.created_on);
      toreturn.push(tracking_factory(tracking));
    }
    return toreturn;
  }

  //je li tracking pohranjen u bazu podataka?
  async isSavedToDb() {
    if (this.id === undefined) return false;
    let trackings = await Tracking.fetchBy("id", this.id);
    return trackings.length == 1;
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
      "INSERT INTO trackings (userid, size, url, created_on, until, success) VALUES (" +
      [
        f(this.userid),
        f(this.size),
        f(this.url),
        f(this.created_on),
        f(this.until),
        f(this.success),
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

  /*static _stringify_all(a) {
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
  }*/

  //dobavi sve trackinge jednog user id-a
  static async getAllByUserId(userid) {
    var all = await Tracking.dbGetBy(
      "trackings",
      "userid",
      "'"+userid+"'"
    );
    var allTrackings = [];
    for (const tracking of all) {
      allTrackings.push(
        new Tracking(
          tracking.id,
          tracking.userid,
          tracking.url,
          tracking.size,
          tracking.created_on,
          tracking.until,
          tracking.success
        )
      );
    }
    return allTrackings;
  }
  
  //dobavi trackinge koji traju
  static async getInProgress() {
    var inProgress = await Tracking.dbGetBy(
      "trackings",
      "success",
      "'in-progress'"
    );
    var inProgressTrackings = [];
    for (const tracking of inProgress) {
      inProgressTrackings.push(
        new Tracking(
          tracking.id,
          tracking.userid,
          tracking.url,
          tracking.size,
          tracking.created_on,
          tracking.until,
          tracking.success
        )
      );
    }
    return inProgressTrackings;
  }

  //dobavi gotove uspješne trackinge
  static async getSuccessful() {
    var successful = await Tracking.dbGetBy("trackings", "success", "'true'");
    var successfulTrackings = [];
    for (const tracking of successful) {
      successfulTrackings.push(
        new Tracking(
          tracking.id,
          tracking.userid,
          tracking.url,
          tracking.size,
          tracking.created_on,
          tracking.until,
          tracking.success
        )
      );
    }
    return successfulTrackings;
  }

  //dobavi gotove neuspješne trackinge
  static async getUnsuccessful() {
    var unsuccessful = await Tracking.dbGetBy(
      "trackings",
      "success",
      "'false'"
    );
    var unsuccessfulTrackings = [];
    for (const tracking of unsuccessful) {
      unsuccessfulTrackings.push(
        new Tracking(
          tracking.id,
          tracking.userid,
          tracking.url,
          tracking.size,
          tracking.created_on,
          tracking.until,
          tracking.success
        )
      );
    }
    return unsuccessfulTrackings;
  }

  //ako postoji tracking za isti link kod iste osobe za istu veličinu
  async conflictsWithDb() {
    const sql =
      `SELECT * from trackings WHERE userid = '` +
      this.userid +
      `' AND url = '` +
      this.url +
      `' AND size = '` +
      this.size +
      `'`;
    const result = await db.query(sql, []);
    return result.length > 0;
  }

  async updateDb() {
    console.log("updating...");
    const sql =
      `UPDATE trackings 
                    SET userid= '` +
      this.userid +
      `' , size= '` +
      this.size +
      `' , url= '` +
      this.url +
      "' , created_on= '" +
      this.created_on.toISOString().slice(0, 19).replace("T", " ") +
      "' , until= '" +
      this.until.toISOString().slice(0, 19).replace("T", " ") +
      "' , success= '" +
      this.success +
      `' WHERE id= '` +
      this.id +
      `'`;
    return await db.query(sql, []);
  }
}

module.exports = Tracking;
