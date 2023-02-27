const db = require("../db");

class User {
  //konstruktor korisnika
  constructor(id = undefined, mail = undefined, password = undefined) {
    this.id = id;
    this.mail = mail;
    this.password = password;
  }

  //dohvat korisnika na osnovu mail adrese
  static async fetchBymail(mail) {
    mail = "'" + mail + "'";
    let results = await User.dbGetUserBy("mail", mail, "users");
    let newUser = undefined;

    if (results.length > 0) {
      newUser = new User(results[0].id, results[0].mail, results[0].password);
    }
    return newUser;
  }

  //dohvat korisnika na osnovu id korisnika (tablica users)
  static async fetchById(id) {
    let results = await User.dbGetUserBy("id", id, "users");
    let newUser = new User();

    if (results.length > 0) {
      newUser = new User(results[0].id, results[0].mail, results[0].password);
    }
    return newUser;
  }

  static async getAll() {
    const sql = "SELECT users.id, users.mail, users.password FROM users";
    const results = await db.query(sql, []);
    if (results.length === 0) throw "user all does not exist";
    let toreturn = [];
    for (let result of results)
      toreturn.push(new User(result.id, result.mail, result.password));
    return toreturn;
  }

  //da li je korisnik pohranjen u bazu podataka?
  async isUserInDb() {
    if (this.id === undefined) return false;
    let u = await User.fetchById(this.id);
    return u.id !== undefined;
  }

  //provjera zaporke
  checkPassword(password) {
    return this.password ? this.password === password : false;
  }

  async isAdmin() {
    return await this._checkIsIn("admin");
  }

  async isUser() {
    return await this._checkIsIn("users");
  }

  async _checkIsIn(where) {
    const sql = "SELECT * FROM " + where + " where id = " + this.id;
    const result = await db.query(sql, []);
    return result.length > 0;
  }

  //dohvat korisnika iz baze podataka na osnovu `what` i `table` odakle uzimamo
  // to moze biti doctor, nurse, admin, patient...
  static async dbGetUserBy(what, that, table) {
    const sql = "SELECT * FROM " + table + " WHERE " + what + " = " + that;
    const result = await db.query(sql, []);
    return result;
  }

  //umetanje zapisa o korisniku u bazu podataka
  async saveUserToDb() {
    if (this.id !== undefined)
      throw "cannot have defined id and try to save the user";

    const sql =
      "INSERT INTO users (mail, password) VALUES ('" +
      this.mail +
      "', '" +
      this.password +
      "') RETURNING id;";

    const result = await db.query(sql, []);
    this.id = result[0].id;
    return result;
  }

  async _saveIdToDb(table) {
    if (this.id !== undefined)
      throw "cannot have defined id and try to save the user";
    const sql = "INSERT INTO " + table + " (id) VALUES ('" + this.id + " )";
    const result = await db.query(sql, []);
  }

  //brisanje zapisa o korisniku u bazi podataka
  async removeUserFromDb() {
    if (this.id === undefined)
      throw "cannot have defined id and try to save the user";

    const sql = "DELETE FROM users where id = " + this.id;
    const result = await db.query(sql, []);
    this.id = undefined;
    return result;
  }

  copySelfUser() {
    return User(this.id, this.mail, this.password);
  }
}

class Admin extends User {
  constructor(id, mail, password) {
    super(id, mail, password);
  }
  async addToDb() {
    if (await this.isUserInDb()) console.log("user already there");
    else await this.saveUserToDb();
    const sql = "INSERT INTO admin (id) VALUES (" + this.id + " )";
    await db.query(sql, []);
  }

  static async getById(id) {
    let users = await Admin.dbGetUserBy("id", id, "users");
    let user = users[0];
    const sql = "SELECT * FROM admin WHERE id = " + id;
    const result = await db.query(sql, []);
    if (result.length === 0) throw "admin does not exist";
    return new Admin(user.id, user.mail, user.password);
  }
}

module.exports = {
  User: User,
  Admin: Admin,
};
