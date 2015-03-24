apparition
==========

[![Build Status](https://travis-ci.org/jagoda/apparition.svg?branch=master)](https://travis-ci.org/jagoda/apparition)

> A collection of test helpers.

## Overview

	npm install apparition

## Properties

The `Properties` helper provides a managed way to make changes to an object's
properties and then roll those changes back at a later point.

Every method other than `get()` returns a chainable reference to the properties
object.

### new Properties (subject)

| parameter | description                                   |
|-----------|-----------------------------------------------|
| subject   | the object managed by the helper              |

Initializes a new `Properties` helper instance.

### properties.delete (name)

| parameter | description                        |
|-----------|------------------------------------|
| name      | the name of the property to delete |

**returns** a chainable self reference

Unsets a specified object property.

### properties.get (name)

| parameter | description                          |
|-----------|--------------------------------------|
| name      | the name of the property to retrieve |

**returns** the value of the property or `undefined` if not set.

Retrieves the current value of a specified property.

### properties.restore ()

Reverts all changes to the object since the last call to `restore()`.

**returns** a chainable self reference

### properties.set (name, [value])

| parameter | description                        |
|-----------|------------------------------------|
| name      | the name of the property to update |
| value     | _optional_ the value to set        |

**returns** a chainable self reference

Sets the value of a specified property. If the value is omitted,
this is the same as calling `delete(name)`.

## Environment

The `Environment` helper provides a managed way to make changes to the process
environment and then roll those changes back at a later point. This is often
useful when testing code that relies on environment variables.

All operations will normalize variable names to upper case. Every method other
than `get()` returns a chainable reference to the environment object.

`Environment` extends the `Properties` API.

### new Environment()

Initializes a new `Environment` helper instance.

### environment.delete (name)

| parameter | description                        |
|-----------|------------------------------------|
| name      | the name of the variable to delete |

**returns** a revert function

Unsets a specified environment variable.

### environment.get (name)

| parameter | description                          |
|-----------|--------------------------------------|
| name      | the name of the variable to retrieve |

**returns** the value of the environment variable or `undefined` if not set.

Retrieves a specified environment variable's current value.

### environment.restore ()

Reverts all changes to the environment since the last call to `restore()`.

**returns** a chainable self reference

### environment.set (name, [value])

| parameter | description                        |
|-----------|------------------------------------|
| name      | the name of the variable to update |
| value     | _optional_ the value to set        |

**returns** a chainable self reference

Sets the value of a specified environment variable. If the value is omitted,
this is the same as calling `delete(name)`.

## Request

The `Request` helper provides a convenience API for constructing request objects
that can be injected into [Hapi][hapi] server instances.

All operations other that `inject()` return a chainable reference to the
request object.

### new Request (method, path)

| parameter | description                           |
|-----------|---------------------------------------|
| method    | the HTTP request method to use        |
| path      | the endpoint to submit the request to |

Instantiates a new `Request` helper instance. The method name is normalized to
lower case.

### request.header (name, value)

| parameter | description                      |
|-----------|----------------------------------|
| name      | the name of the header to define |
| value     | the header value                 |

**returns** a chainable self reference

Defines a header value to be included with the request.

### request.inject (server)

| parameter | description                                                      |
|-----------|------------------------------------------------------------------|
| server    | the [Hapi][hapi] server instance that should process the request |

**returns** a promise that is resolved with the response object. See the
[Hapi API documentation][hapi-inject] for more details.

Submits the request to a server instance for processing.

### request.mime (type)

| parameter | description                             |
|-----------|-----------------------------------------|
| type      | the content type of the request payload |

**returns** a chainable self reference

Defines the MIME type of the request payload. When the MIME type is set to
either `application/json` or `application/x-www-form-urlencoded` then the value
passed to `payload()` will be encoded as that type. All other payloads are
encoded as strings.

### request.payload (content)

| parameter | description                             |
|-----------|-----------------------------------------|
| content   | the content to include as the payload   |

**returns** a chainable self reference

Defines a payload for the request. Objects are automatically encoded based on
the content type set with `mime()`. It is an error to call `payload()` on a
`Request` object that does not use either the `post` or `put` HTTP method.

### request.user (username, password)

| parameter | description                                 |
|-----------|---------------------------------------------|
| password  | the password portion of the user credential |
| username  | the username portion of the user credential |

**returns** a chainable self reference

Authenticates the request object according to the [HTTP Basic Auth][basic-auth]
scheme.

[basic-auth]: http://tools.ietf.org/html/rfc2617 "HTTP Basic Auth"
[hapi]: http://hapijs.com/ "hapi"
[hapi-inject]: https://github.com/hapijs/hapi/blob/master/API.md#serverinjectoptions-callback "server.inject()"
