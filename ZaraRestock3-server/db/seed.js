const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "zararestock",
  password: "postgres",
  port: 5432,
});

const drop_tables = `
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
`;

const sql_create_users = `CREATE TABLE users (
    id int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    surname text NOT NULL,
    sex text NOT NULL,
    phoneNumber text NOT NULL UNIQUE,
    mail text NOT NULL UNIQUE,
    password text NOT NULL,
    dateOfBirth date NOT NULL
)`;

const sql_create_admin = `CREATE TABLE admin (
    id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES users(id)
)`;

const sql_create_patient = `CREATE TABLE patient (
    id INT NOT NULL,
    doctorid INT NOT NULL,
    nFailedAppointments INT NOT NULL,
    notificationMethod text NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (doctorid) REFERENCES doctor(id)
)`;

const sql_create_doctor = `CREATE TABLE doctor (
    id INT NOT NULL,
    teamid INT,
    appointmentRule INT,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (teamid) REFERENCES team(teamid)
)`;

const sql_create_nurse = `CREATE TABLE nurse (
    id INT NOT NULL,
    teamid INT,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (teamid) REFERENCES team(teamid)
)`;

const sql_create_team = `CREATE TABLE team (
    teamid INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL
)`;

const sql_create_appointment = `CREATE TABLE appointment (
    id int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patientid INT,
    doctorid INT,
    nurseid INT,
    time TIMESTAMP WITHOUT TIME ZONE,
    duration INTERVAL, 
    created_on TIMESTAMP WITHOUT TIME ZONE,
    changes_from int,
    type TEXT,
    patient_came BOOLEAN,
    
    FOREIGN KEY (patientid) REFERENCES patient(id),
    FOREIGN KEY (doctorid) REFERENCES doctor(id),
    FOREIGN KEY (nurseid) REFERENCES nurse(id),
    FOREIGN KEY (changes_from) REFERENCES appointment(id)
)`; // TODO fix duration

const sql_insert_users = `INSERT INTO users (name, surname, sex, phoneNumber, mail, password, dateOfBirth) VALUES 
('Julijan', 'Zlataric', 'M', '0971012013', 'JulijanZlataric0@gmail.com', '11112013', '1938-7-8'),
('Neo', 'Sneberger', 'M', '0911012014', 'NeoSneberger1@gmail.com', '11122014', '1929-10-25'),
('Evona', 'Tudoric-Gemo', 'Z', '0911012015', 'EvonaTudoric-Gemo2@gmail.com', '11132015', '1935-2-20'),
('Ljerko', 'Stipetic', 'M', '0941012016', 'LjerkoStipetic3@gmail.com', '11142016', '1978-7-14'),
`;

const sql_insert_team = `INSERT INTO team (name) VALUES ('Prvi'), ('Drugi'), ('Treci')`;
const sql_insert_admin = `INSERT INTO admin (id) VALUES (2), (3), (5)`;
const sql_insert_doctor = `INSERT INTO doctor (id, teamid, appointmentRule) VALUES (7, NULL, NULL), (1, 1, NULL), (2, NULL, NULL), (3, 2, NULL), (4, 3, NULL), (5, NULL, NULL), (6, NULL, NULL), (10, NULL, NULL), (8, NULL, NULL), (9, NULL, NULL)`;
const sql_insert_nurse = `INSERT INTO nurse (id, teamid) VALUES (8, NULL), (10, 1), (12, NULL), (14, 2), (16, 3)`;
const sql_insert_patient = `INSERT INTO patient (nFailedAppointments, id, doctorid, notificationMethod) VALUES 
    (0, 100, 7, 'email'), (0, 101, 7, 'email'), (0, 102, 7, 'email')`;

const sql_insert_appointments = `INSERT INTO appointment (patientid, doctorid, nurseid, time, duration) VALUES 
    (100, 7, NULL, '2015-01-10 00:51:14', '00:20:00'),
    (101, 7, NULL, '2015-01-10 01:51:14', '00:20:00'),
    (101, 9, NULL, '2015-01-10 01:51:14', '00:20:00'),
    (101, 7, NULL, '2023-01-01 22:00:14', '02:20:00')
`;

let table_names = [
  "users",
  "admin",
  "team",
  "doctor",
  "nurse",
  "patient",
  "appointment",
];

let tables = [
  sql_create_users,
  sql_create_admin,
  sql_create_team,
  sql_create_doctor,
  sql_create_nurse,
  sql_create_patient,
  sql_create_appointment,
];

let table_data = [
  sql_insert_users,
  sql_insert_admin,
  sql_insert_team,
  sql_insert_doctor,
  sql_insert_nurse,
  sql_insert_patient,
  sql_insert_appointments,
];

let indexes = [];

if (
  tables.length !== table_data.length ||
  tables.length !== table_names.length
) {
  console.log("tables, names and data arrays length mismatch.");
  return;
}

//create tables and populate with data (if provided)

(async () => {
  console.log("Dropping tables");
  try {
    await pool.query(drop_tables, []);
    console.log("dropped all tables.");
  } catch (err) {
    console.log("Error could not drop all tables");
  }

  console.log("Creating and populating tables");
  for (let i = 0; i < tables.length; i++) {
    console.log("Creating table " + table_names[i] + ".");
    console.log(tables[i]);
    try {
      await pool.query(tables[i], []);
      console.log("Table " + table_names[i] + " created.");
      if (table_data[i] !== undefined) {
        try {
          await pool.query(table_data[i], []);
          console.log("Table " + table_names[i] + " populated with data.");
        } catch (err) {
          console.log(
            "Error populating table " + table_names[i] + " with data."
          );
          return console.log(err.message);
        }
      }
    } catch (err) {
      console.log("Error creating table " + table_names[i]);
      return console.log(err.message);
    }
  }

  console.log("Creating indexes");
  for (let i = 0; i < indexes.length; i++) {
    try {
      await pool.query(indexes[i], []);
      console.log("Index " + i + " created.");
    } catch (err) {
      console.log("Error creating index " + i + ".");
    }
  }

  await pool.end();
})();

// sudo -u postgres psql -c 'create database test;'
