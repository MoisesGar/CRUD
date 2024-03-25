CREATE DATABASE storedb
USE storedb

create table categoria(
	ID_CategoriaProducto int not null AUTO_INCREMENT,
    Descripcion varchar(20),
    Eliminado boolean Default 0,
    Primary Key (ID_CategoriaProducto)
)
create table productos(
	ID_Productos int not null AUTO_INCREMENT,
    Descripcion varchar(30),
    Precio Decimal(8,2),
    Cantidad int,
    Stock_Min int,
    Stock_Max int,
    Eliminado boolean Default 0,
    ID_CategoriaProducto int,
    Primary key (ID_Productos),
    Foreign Key (ID_CategoriaProducto) references categoria(ID_CategoriaProducto)
)

INSERT INTO categoria (Descripcion)
VALUES ('Limpieza')

INSERT INTO productos (Descripcion, Precio, Cantidad, Stock_Min, Stock_Max, ID_CategoriaProducto)
VALUES ('ESCOBA', 10.99, 100, 50, 200, 1);

INSERT INTO productos (Descripcion, Precio, Cantidad, Stock_Min, Stock_Max, ID_CategoriaProducto)
VALUES ('TRAPEADOR', 12.00, 100, 50, 200, 1);

