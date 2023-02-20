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
    username text NOT NULL UNIQUE,
    mail text NOT NULL UNIQUE,
    password text NOT NULL
)`;

const sql_create_admin = `CREATE TABLE admin (
    id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES users(id)
)`;

const sql_create_trackings = `CREATE TABLE trackings (
  id int  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  userid INT,
  url text,
  size text,
  created_on TIMESTAMP WITHOUT TIME ZONE,
  until TIMESTAMP WITHOUT TIME ZONE,
  success text,
  FOREIGN KEY (userid) REFERENCES users(id)
)`;

const sql_insert_users = `INSERT INTO users (username, mail, password) VALUES 
('AaBb', 'aabb0@gmail.com', 'password1'),
('CcDd', 'ccdd0@gmail.com', 'password2'),
('EeFf', 'eeff@gmail.com', 'password3'),
('GgHh', 'gghh@gmail.com', 'password4')
`;

const sql_insert_admin = `INSERT INTO admin (id) VALUES (4)`;

const sql_insert_trackings = `INSERT INTO trackings (userid, url, size, created_on, until, success) VALUES 
(1, 'https://www.zara.com/hr/hr/elasticna-majica-sa-sirokim-naramenicama-p03905931.html?v1=232669686', 'M', '2023-02-16 00:51:14', '2023-02-23 00:51:14', 'in-progress'),
(2, 'https://www.zara.com/hr/hr/haljina-od-strukturirane-tkanine-p06560267.html?v1=207813905&utm_campaign=productMultiShare&utm_medium=mobile_sharing_Android&utm_source=red_social_movil', '9-12 mjeseci (80 cm)', '2023-02-15 10:00:00', '2023-03-05 10:00:00', 'false'),
(3, 'https://www.zara.com/hr/hr/elasticna-majica-sa-sirokim-naramenicama-p03905931.html?v1=232669686', 'L', '2023-02-25 01:51:14', '2023-03-11 01:51:14', 'true'),
(1, 'https://www.zara.com/hr/hr/haljina-od-strukturirane-tkanine-p06560267.html?v1=207813905&utm_campaign=productMultiShare&utm_medium=mobile_sharing_Android&utm_source=red_social_movil', 'M', '2023-02-16 00:51:14', '2023-02-23 00:51:14', 'in-progress')
`;

let table_names = ["users", "admin", "trackings"];

let tables = [sql_create_users, sql_create_admin, sql_create_trackings];

let table_data = [sql_insert_users, sql_insert_admin, sql_insert_trackings];

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
