# OCMI Workers Comp - QA Automation Engineer - Technical Test by Santiago Orjuela

This project is a copy of the OCMI Workers Comp technical test project, with the difference that more unit tests were implemented for both server and client to meet the technical test requirements.

## System Requirements

- NodeJS 20.x or higher
- Yarn 4.x or higher
- We recommend a Unix-based system (Linux, MacOS) for this assessment

### Running the API

- Serve: `npx nx run server:serve`
- Unit Tests: `npx nx run server:test`
- E2E Tests: `npx nx run server-e2e:e2e`

### Running the React App

- Serve: `npx nx run client:serve`
- Unit Tests: `npx nx run client:test`
- E2E Tests: `npx nx run client-e2e:e2e`

## Solutions

**Server Unit Tests**

- For server unit tests in: `apps/server/src/routes/auth.spec.ts`
  A total of 6 unit tests were implemented for auth including existing ones:
  - `should not create a new session if already logged in`
  - `should reject login if user does not exist`
  - `should reject login with incorrect case in username or password`
  - `should reject access with an expired or invalid session token`
  - `should require both username and password`
  - `the fields could not be empty`

  All these tests have a comment indicating the test name and that it was done by Santiago Orjuela (sago-code), to easily identify them from others.

  * Created `apps/server/src/routes/posts.spec.ts` for server unit tests on posts.
    This route contains a total of 7 unit tests which are:
    - `should create a post successfully`
    - `should require both title and content in the create post`
    - `should get a one post successfully`
    - `should get all posts successfully`
    - `should update a post successfully`
    - `Should require both title and content when updating post`
    - `Should be erase the selected post successfully`

  Each test covers a specific aspect of posts, such as creation, updating, retrieving or displaying posts, and post deletion.

  * Created `apps/server/src/routes/users.spec.ts` for server unit tests on users, including favorite book selection and/or updating.
    This route contains a total of 6 unit tests which are:
    - `It should return the user who logged in`
    - `should create a new user successfully`
    - `should require both username and password in the create user`
    - `should return validation errors if username or password do not meet minimum length requirements`
    - `should update the username of the logged-in user successfully`
    - `should select and update the favorite book of the logged-in user`
  
  Each test covers a specific aspect of users, such as creation, user updating, and favorite book selection and/or updating.

**Client Unit Tests**

- *For client unit tests:* 
in: `apps/client/src/pages/root.spec.tsx`
  A total of 9 unit tests were implemented which are:
  - `should persist session data after redirect to /posts`
  - `should not call get after redirecting to /login or /posts`
  - `should handle error in useStorage.get gracefully`
  - `should use useStorage to get the session data`
  - `should redirect only after useEffect completes`
  - `should not change the redirecting message during the redirect`
  - `should not attempt to set session data when no session exists`
  - `should redirect to /login when session data is invalid JSON`
  - `should not re-execute useEffect if session data does not change`

  These tests have a comment indicating the test name and that it was done by Santiago Orjuela (sago-code), to easily identify them from others.

  * Created `apps/client/src/app/profile.spec.tsx` for client unit tests on the root.
   Where a total of 4 unit tests were implemented which are:
   - `should display loading state while fetching user profile`
   - `should display an error state when there is an error fetching user profile`
   - `should display "No favorite book selected" if the user has no favorite book`
   - `should update the favorite book when a new book is selected`

  Each test covers a specific aspect of the profile page, such as loading state, error state, no favorite book selection state, and favorite book updating.

  * Created `apps/client/src/app/login.spec.tsx` for client unit tests on the root.
   Where a total of 4 unit tests were implemented which are:
   - `should render login form with username and password fields`
   - `should submit form with valid username and password`
   - `should allow typing in the username field`
   - `should allow typing in the password field`

  Each test covers a specific aspect of the login page, such as form rendering, form submission, data input in username and password fields.

**E2E Tests**

- *Server E2E Tests:* 
in: `apps/server-e2e/src/server/posts.e2e.ts`
  A total of 4 E2E tests were implemented which are:
  - `should update a post successfully`
  - `should delete a post successfully`
  - `should not allow updating a post with invalid data`
  - `should not allow deleting a post without authorization`

  These tests have a comment indicating the test name and that it was done by Santiago Orjuela (sago-code), to easily identify them from others.

  * Created `apps/server-e2e/src/server/auth.e2e.ts` for Server E2E tests on authentication.
    Where a total of 4 E2E tests were implemented which are:
    - `should login successfully with valid credentials`
    - `should reject login with invalid credentials`
    - `should logout successfully with a valid token`
    - `should reject logout without authentication`

    Each test covers a specific aspect of authentication, such as login with valid credentials, login with invalid credentials, logout with valid token, and logout without authentication.

  * Created `apps/server-e2e/src/server/user.e2e.ts` for Server E2E tests on user.
    Where a total of 4 E2E tests were implemented which are:
    - `should register a new user successfully`
    - `should fetch user data successfully`
    - `should update user data successfully`
    - `should return 422 for invalid data`

    Each test covers a specific aspect of user, such as new user registration, user data retrieval, user data updating, and invalid data handling.

- *Client E2E Tests:* 
  in: `apps/client-e2e/src/client/posts.e2e.ts`
  Only 2 E2E tests were implemented here which are:
    - `can edit an existing post`
    - `can delete an existing post`
  
  Only 2 tests were implemented here because Playwright had conflicts with my machine that I tried to solve but couldn't manage to fix neither in Windows nor Linux, so I couldn't perform more tests here, but the ones implemented meet the technical test requirements.
  
  I hope this is sufficient to meet the technical test requirements, thank you in advance.
