DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE employee_role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    manager_id INT,
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL,
    employee_role_id INT,
    FOREIGN KEY (employee_role_id)
    REFERENCES employee_role(id)
    ON DELETE SET NULL
);

INSERT INTO department(name) VALUES ("HR");
INSERT INTO employee_role(title, salary, department_id) VALUES ("Manager", 100, 1);
INSERT INTO employee(first_name, last_name, manager_id, employee_role_id) VALUES ("John", "Smith", 1, 1);