<p align="right">
  <img height="200" src="./afa.png" />
</p>

## Objetivos del Proyecto

- **Registro de usuarios**:
    - Los usuarios deben estar en la capacidad de registrarse indicando un correo electrónico, un nombre y una contraseña.
- **Autenticación de usuarios:**
    - Los usuarios podrán ingresar en su cuenta ingresando el correo y contraseña del registro.
- **Perfil de Usuarios:**
    - Los usuarios podrán agregar una dirección de residencia y una foto de perfil.
    - La dirección de residencia y foto de perfil se puede editar en cualquier momento.
- **Inventario de productos:**
    - Se debe poder agregar libros indicando el ISBN, título del libro, precio, autor, editorial y número de existencias.
    - En un futuro queremos tener más productos, pero no tenemos características especificas para esos productos, más allá del precio, código, nombre del producto y número de existencias.
    - Se debe poder actualizar las existencias de los producto ens cualquier momento.
    - Se debe poder registrar el ingreso (compra) de un producto indicando el distribuidor y la cantidad comprada.
    - Se debe poder consultar la lista de productos con sus existencias.
- **Productos**
    - El usuario debe poder agregar un producto al carrito de compras.
    - El usuario debe poder comprar un producto
        - Si no hay existencias, se le debe notificar al usuario al finalizar la compra.
    - El usuario debe poder consultar la lista de productos.
- Plus si construye el API con NodeJs.
- Se debe conectar a una base de datos. Plus si utiliza PostgreSQL y Prisma como ORM.
- Es importante que el API tenga documentación que explique como es su manejo.
- Tenga en cuenta parámetros de seguridad y documente que implementaciones de seguridad ha utilizado.


## Comenzando

__IMPORTANTE:__ Es necesario contar minimamente con la última versión estable de Node y NPM. Asegurarse de contar con ella para poder instalar correctamente las dependecias necesarias para correr el proyecto.

- __Node__: 12.18.3 o mayor
- __NPM__: 6.14.16 o mayor


En `api` abir una terminal y instalar todas las dependencias (npm i) despues crear un archivo llamado: `.env` que tenga la siguiente forma:

```env
DB_USER=usuariodepostgres
DB_PASSWORD=passwordDePostgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dbname
```

Reemplazar `usuariodepostgres` y `passwordDePostgres` con tus propias credenciales para conectarte a postgres. Este archivo va ser ignorado en la subida a github, ya que contiene información sensible (las credenciales).

Adicionalmente será necesario crear desde psql una base de datos y poner el mismo nombre que en el archivo .env DB_NAME

### Endpoints a utilizar en postman/insomnia

http://localhost:3001/users/usuarios --> POST --> creacion de usuarios

http://localhost:3001/products/productos --> POST --> creacion de productos

http://localhost:3001/products/productos/:id --> PATCH --> modificacion de existencias de productos

http://localhost:3001/users/login --> POST --> loggin de usuarios

http://localhost:3001/users/usuarios/:id --> PUT --> modificacion de direccion y foto de usuario

http://localhost:3001/products/productos/all --> GET --> consultar productos

http://localhost:3001/buys/compras --> POST --> ingreso de producto de producto por distribuidor

http://localhost:3001/users/:userid/carrito/:productid --> POST --> agregar un producto al carrito