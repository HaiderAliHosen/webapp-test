SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS users, murmurs, follows, likes, test;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE test (
  id int NOT NULL AUTO_INCREMENT primary key,
  name varchar(30),
  description varchar(255)
);

INSERT INTO test (id, name, description) VALUES (1, 'test1', 'This is test data 1');
INSERT INTO test (id, name, description) VALUES (2, 'test2', 'This is test data 2');
INSERT INTO test (id, name, description) VALUES (3, 'test3', 'This is test data 3');
INSERT INTO test (id, name, description) VALUES (4, 'test4', 'This is test data 4');
INSERT INTO test (id, name, description) VALUES (5, 'test5', 'This is test data 5');
INSERT INTO test (id, name, description) VALUES (6, 'test6', 'This is test data 6');
INSERT INTO test (id, name, description) VALUES (7, 'test7', 'This is test data 7');
INSERT INTO test (id, name, description) VALUES (8, 'test8', 'This is test data 8');
INSERT INTO test (id, name, description) VALUES (9, 'test9', 'This is test data 9');
INSERT INTO test (id, name, description) VALUES (10, 'test10', 'This is test data 10');

/* ALTER USER 'docker'@'localhost' IDENTIFIED WITH mysql_native_password BY 'docker' */
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  bio TEXT,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Murmurs table
CREATE TABLE IF NOT EXISTS murmurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
  follower_id INT NOT NULL,
  following_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_following_id (following_id) -- Improves query performance
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  user_id INT NOT NULL,
  murmur_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, murmur_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (murmur_id) REFERENCES murmurs(id) ON DELETE CASCADE,
  INDEX idx_murmur_id (murmur_id) -- Improves query performance
);

-- Modify users table to explicitly handle empty strings
ALTER TABLE users 
MODIFY username VARCHAR(50) NOT NULL DEFAULT UUID(),
MODIFY email VARCHAR(100) NOT NULL DEFAULT CONCAT(UUID(), '@example.com');

-- initial data that respects constraints
INSERT INTO users (username, email, password, name, bio) VALUES 
('user1', 'user1@real.com', '$2a$10$x...', 'User One', 'First test user'),
('user2', 'user2@real.com', '$2a$10$x...', 'User Two', 'Second test user');

INSERT INTO murmurs (user_id, content) VALUES
(1, 'This is my first murmur!'),
(2, 'Hello world from user 2!'),
(1, 'Another murmur from user 1');

INSERT INTO follows (follower_id, following_id) VALUES
(1, 2); -- User 1 follows User 2

INSERT INTO likes (user_id, murmur_id) VALUES
(2, 1); -- User 2 likes User 1's first murmur

-- For authentication security:
-- ALTER TABLE users MODIFY password VARCHAR(255) NOT NULL COMMENT 'Store bcrypt hashed passwords only';

-- For soft deletion (optional)
-- ALTER TABLE murmurs ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

-- For better text search
-- ALTER TABLE murmurs ADD FULLTEXT INDEX idx_content (content);