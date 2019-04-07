-- BLOCK create_user
INSERT INTO users(email,password,name,netid)
VALUES ($email, $password, $name, $netid)
