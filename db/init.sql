CREATE DATABASE inventory;
USE inventory;

-- 库存表
CREATE TABLE Color (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    grams FLOAT NOT NULL
);

-- 套餐表
CREATE TABLE Package (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    colors TEXT NOT NULL, -- 存储颜色 ID 列表
    deduction FLOAT NOT NULL
);

-- 订单记录表
CREATE TABLE Order (
    id INT AUTO_INCREMENT PRIMARY KEY,
    package_name VARCHAR(50) NOT NULL,
    colors TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 示例数据
INSERT INTO Color (name, grams) VALUES ('红色', 500);
INSERT INTO Color (name, grams) VALUES ('蓝色', 450);
INSERT INTO Color (name, grams) VALUES ('黄色', 600);
