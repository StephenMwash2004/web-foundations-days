# Library Books REST API

## 1. List All Books

- **Method:** GET
- **Path:** /books
- **Description:** Returns all books.
- **Success Status:** 200 OK

---

## 2. Get One Book

- **Method:** GET
- **Path:** /books/{id}
- **Description:** Returns one book by its ID.
- **Success Status:** 200 OK

---

## 3. Create a Book

- **Method:** POST
- **Path:** /books
- **Description:** Creates a new book.
- **Request Body**

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "year": 2008
}
```

- **Success Status:** 201 Created

---

## 4. Update a Book

- **Method:** PUT
- **Path:** /books/{id}
- **Description:** Updates an existing book.

### Request Body

```json
{
  "title": "Clean Code (2nd Edition)",
  "author": "Robert C. Martin",
  "year": 2025
}
```

- **Success Status:** 200 OK

---

## 5. Delete a Book

- **Method:** DELETE
- **Path:** /books/{id}
- **Description:** Deletes a book.
- **Success Status:** 204 No Content

---

## 6. List Books by Author

- **Method:** GET
- **Path:** /books?author=Robert%20C.%20Martin
- **Description:** Returns books written by the specified author.
- **Success Status:** 200 OK

---

# Error Codes

## 400 Bad Request

Occurs when the request contains invalid or missing data.

Example:

```json
{
  "title": "",
  "author": ""
}
```

---

## 404 Not Found

Occurs when the requested book ID does not exist.

Example:

```
GET /books/9999
```

If book **9999** does not exist, the server returns:

```
404 Not Found
```