# OCMI Workers Comp - Ingeniero de Automatización de QA - prueba tecnica de Santiago Orjuela

El proyecto es una copia del proyecto de prueba tecnica de OCMI Workers Comp, con la diferencia de que se implementaron mas pruebas unitarias para el servidor y el cliente para cumplir con los requisitos de la prueba tecnica.

## Requisitos del Sistema

- NodeJS 20.x o superior
- Yarn 4.x o superior
- Recomendamos un sistema basado en Unix (Linux, MacOS) para esta evaluación

### Ejecutando la API

- Servir: `npx nx run server:serve`
- Pruebas Unitarias: `npx nx run server:test`
- Pruebas E2E: `npx nx run server-e2e:e2e`

### Ejecutando la Aplicación React

- Servir: `npx nx run client:serve`
- Pruebas Unitarias: `npx nx run client:test`
- Pruebas E2E: `npx nx run client-e2e:e2e`

## Soluciones


**Pruebas Unitaria del Servidor**

- Para las pruebas unitarias de servidor en: `apps/server/src/routes/auth.spec.ts`
  Se implementaron un total de 6 pruebas unitarias para auth incluyendo las que ya existían.
  las cuales son:
  - `should not create a new session if already logged in`
  - `should reject login if user does not exist`
  - `should reject login with incorrect case in username or password`
  - `should reject access with an expired or invalid session token`
  - `should require both username and password`
  - `the fields could not be empty`

  Todas estas pruebas tienen un comentario que indica el nombre de la prueba y que fue realizada por Santiago Orjuela (sago-code), para poder identificar facilmente de las demas.

  * Se creo `apps/server/src/routes/posts.spec.ts` para las pruebas unitarias de servidor en los posts.
    Esta ruta contiene un total de 7 pruebas unitarias las cuales son:
    - `should create a post successfully`
    - `should require both title and content in the create post`
    - `should get a one post successfully`
    - `should get all posts successfully`
    - `should update a post successfully`
    - `Should require both title and content when updating post`
    - `Should be erase the selected post successfully`

  Cada prueba cubre un punto especifico de los posts, como la creacion, actualizacion, obtención o muestra de post y eliminacion de un post.

  * Se creo `apps/server/src/routes/users.spec.ts` para las pruebas unitarias de servidor en usuarios, incluyendo la seleccion y/o actualización del libro favorito.
    Esta ruta contiene un total de 6 pruebas unitarias las cuales son:
    - `It should return the user who logged in`
    - `should create a new user successfully`
    - `should require both username and password in the create user`
    - `should return validation errors if username or password do not meet minimum length requirements`
    - `should update the username of the logged-in user successfully`
    - `should select and update the favorite book of the logged-in user`
  
  Cada prueba cubre un punto especifico de los usuarios, como la creacion, actualización de usuario y la selección y/o actualización del libro favorito.

**Pruebas Unitaria del Cliente**

- *Para las pruebas unitarias de cliente:* 
en: `apps/client/src/pages/root.spec.tsx`
  Se implementaron un total de 9 pruebas unitarias las cuales son:
  - `should persist session data after redirect to /posts`
  - `should not call get after redirecting to /login or /posts`
  - `should handle error in useStorage.get gracefully`
  - `should use useStorage to get the session data`
  - `should redirect only after useEffect completes`
  - `should not change the redirecting message during the redirect`
  - `should not attempt to set session data when no session exists`
  - `should redirect to /login when session data is invalid JSON`
  - `should not re-execute useEffect if session data does not change`

  Estas pruebas tienen un comentario que indica el nombre de la prueba y que fue realizada por Santiago Orjuela (sago-code), para poder identificarlas de las demas.

  * Se creo `apps/client/src/app/profile.spec.tsx` para las pruebas unitarias de cliente en el root.
   DOnde se implementaron un total de 4 pruebas unitarias las cuales son:
   - `should display loading state while fetching user profile`
   - `should display an error state when there is an error fetching user profile`
   - `should display "No favorite book selected" if the user has no favorite book`
   - `should update the favorite book when a new book is selected`

  Cada prueba cubre un punto especifico de la pagina de perfil, como el estado de carga, el estado de error, el estado de no seleccion de libro favorito y la actualización del libro favorito.

  * Se creo `apps/client/src/app/login.spec.tsx` para las pruebas unitarias de cliente en el root.
   Donde se implementaron un total de 4 pruebas unitarias las cuales son:
   - `should render login form with username and password fields`
   - `should submit form with valid username and password`
   - `should allow typing in the username field`
   - `should allow typing in the password field`

  Cada prueba cubre un punto especifico de la pagina de login, como la renderizacion del formulario, la submisión del formulario, el ingreso de datos en los campos de usuario y contraseña.

**Pruebas E2E**

- *Prueba las pruebas E2E del Servidor:* 
en: `apps/server-e2e/src/server/posts.e2e.ts`
  Se implementaron un total de 4 pruebas E2E las cuales son:
  - `should update a post successfully`
  - `should delete a post successfully`
  - `should not allow updating a post with invalid data`
  - `should not allow deleting a post without authorization`

  Estas pruebas tienen un comentario que indica el nombre de la prueba y que fue realizada por Santiago Orjuela (sago-code), para poder identificarlas de las demas.

  * Se creo `apps/server-e2e/src/server/auth.e2e.ts` para las pruebas E2E del Servidor en la autenticación.
    Donde se implementaron un total de 4 pruebas E2E las cuales son:
    - `should login successfully with valid credentials`
    - `should reject login with invalid credentials`
    - `should logout successfully with a valid token`
    - `should reject logout without authentication`

    Cada prueba cubre un punto especifico de la autenticación, como el login con credenciales validas, el login con credenciales invalidas, el logout con un token valido y el logout sin autenticación.

  * Se creo `apps/server-e2e/src/server/user.e2e.ts` para las pruebas E2E del Servidor en user.
    Donde se implementaron un total de 4 pruebas E2E las cuales son:
    -`should register a new user successfully`
    - `should fetch user data successfully`
    - `should update user data successfully`
    - `should return 422 for invalid data`

    Cada prueba cubre un punto especifico de user, como el registro de un nuevo usuario, la obtención de datos de usuario, la actualización de datos de usuario y el manejo de datos invalidos.

- *Prueba E2E del Cliente:* 
  en: `apps/client-e2e/src/client/posts.e2e.ts`
  En este solo se implementaron 2 pruebas E2E las cuales son:
    - `can edit an existing post`
    - `can delete an existing post`
  
  Solo se implementaron 2 pruebas aca por el motivo de que playwright tenia conflictos con mi maquina y eso que intente solucionar, pero no lo logre ni en windows ni en linux, por lo que no pude realizar mas pruebas aca, pero las que se implementaron cumplen con los requisitos de la prueba tecnica.
  
  Espero que esto sea suficiente para cumplir con los requisitos de la prueba tecnica, de antemano muchas gracias.
